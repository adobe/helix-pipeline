/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable camelcase,no-underscore-dangle */
const querystring = require('querystring');
const { wrap, VersionLock } = require('@adobe/openwhisk-action-utils');
const { logger } = require('@adobe/openwhisk-action-logger');
const { epsagon } = require('@adobe/helix-epsagon');
const { wrap: statusCheck } = require('@adobe/helix-status');

/**
 * Builds the request path from path, selector, extension and params
 * @param {Object} req The action request
 */
function buildPath(req) {
  const p = req.params;
  const rootPath = p.rootPath || '';
  let path = p.path || '/';
  const dot = path.lastIndexOf('.');
  if (dot !== -1) {
    path = path.substring(0, dot);
  }
  const sel = p.selector ? `.${p.selector}` : '';
  const ext = `.${p.extension || 'html'}`;

  // workaround for https://github.com/adobe/helix-pipeline/issues/254 until `contentRoot` is
  // supplied. remove the repo-root-path prefix
  const contentRoot = req.headers ? (req.headers['x-repo-root-path'] || '').replace(/\/*$/, '') : '';
  if (contentRoot && path.startsWith(contentRoot)) {
    path = path.substring(contentRoot.length);
  }

  return `${rootPath}${path}${sel}${ext}`;
}

/**
 * A function that takes OpenWhisk-style req parameter and turns
 * it into the original Express-style request object which is returned.
 * @param {Object} action The pipeline action context
 * @return {Object} an express style request object.
 */
function extractClientRequest(action) {
  const { request } = action;
  if (!request || !request.params) {
    return {};
  }
  const reqPath = buildPath(request);
  let pathInfo = reqPath.replace(/\/*$/, '');
  if (`${pathInfo}/`.startsWith(`${request.params.rootPath}/`)) {
    pathInfo = pathInfo.substring(request.params.rootPath.length);
  }
  const query = request.params.params ? `?${request.params.params}` : '';
  return {
    // the edge encodes the client request parameters into the `params` param ;-)
    params: request.params.params ? querystring.parse(request.params.params) : {},
    headers: request.headers,
    method: request.method,
    path: reqPath,
    extension: request.params.extension || '',
    selector: request.params.selector || '',
    url: `${reqPath}${query}`,
    rootPath: request.params.rootPath,
    queryString: query,
    pathInfo,
  };
}

/**
 * Creates an response for the OpenWhisk Web-Action from the pipeline context
 * @param {Object} context Pipeline context.
 * @param {object} action Action context.
 * @returns {Object} OpenWhisk response
 */
async function createActionResponse(context, action) {
  const {
    response: {
      status,
      headers = { 'Content-Type': 'application/json' },
      body = headers['Content-Type'] === 'application/json' ? {} : '',
    } = {},
    error,
  } = context;
  const ret = {
    statusCode: status || (error ? 500 : 200),
    headers,
    body,
  };
  if (error) {
    // don't set the 'error' property, otherwise openwhisk treats this as application error
    ret.errorMessage = error.message || String(error);
    if (error.stack) {
      ret.errorStack = String(error.stack);
    }
    const level = ret.statusCode >= 500 ? 'error' : 'warn';
    if (action && action.logger) {
      action.logger[level](`Problems while executing action: ${ret.errorMessage}`);
    } else {
      // eslint-disable-next-line no-console
      console[level](`Problems while executing action: ${ret.errorMessage}`);
    }
  }
  return ret;
}

/**
 * Extracts the _Action Context_ from the given OpenWhisk Web-Action invocation params.
 * It _moves_ all params with only uppercase letters to the `secrets` object, and the rest to the
 * `request.params` object.
 *
 * @param {Object} params The wsk action params.
 * @returns {Object} The pipeline action context.
 */
function extractActionContext(params) {
  const {
    __ow_headers,
    __ow_method,
    __ow_logger,
    ...disclosed
  } = params;

  // extract secrets
  const secrets = {};
  Object.keys(disclosed).forEach((key) => {
    if (key.match(/^[A-Z0-9_]+$/)) {
      secrets[key] = disclosed[key];
      delete disclosed[key];
    }
  });

  // extract content (will be added to context)
  delete disclosed.content;

  // setup action
  return {
    secrets,
    versionLock: new VersionLock(params),
    request: {
      params: disclosed,
      headers: __ow_headers || {},
      method: __ow_method || 'get',
    },
    logger: __ow_logger,
  };
}

/**
 * Runs the given pipeline in the context of a OpenWhisk Web-Action invocation.
 * @param {Function} cont The continuation function, aka the `once` function.
 * @param {Function} pipe A pipeline executor.
 * @param {Object} actionParams The wsk action params.
 * @returns {Promise<{error}>} The wsk action response.
 */
async function runPipeline(cont, pipe, actionParams) {
  async function runner(params) {
    // create action context
    const action = extractActionContext(params);

    // context is initially empty
    // todo: think of adding the adaptOWRequestHere, too
    const context = {
      request: extractClientRequest(action),
    };
    if (params.content) {
      // pass content param from request to context
      context.content = params.content;
    }
    return createActionResponse(await pipe(cont, context, action), action);
  }
  // enhance logger if trace method is missing (eg. a winston logger)
  if (actionParams.__ow_logger && !actionParams.__ow_logger.trace) {
    actionParams.__ow_logger.trace = actionParams.__ow_logger.silly;
  }

  return wrap(runner)
    .with(epsagon)
    .with(statusCheck)
    .with(logger.trace)
    .with(logger)(actionParams);
}

module.exports = {
  runPipeline,
  extractActionContext,
  extractClientRequest,
  createActionResponse,
};
