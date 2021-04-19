/*
 * Copyright 2020 Adobe. All rights reserved.
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
const { Response } = require('@adobe/helix-fetch');
const { wrap } = require('@adobe/helix-shared');
const { logger } = require('@adobe/helix-universal-logger');
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
  const text = body !== null && typeof body === 'object' ? JSON.stringify(body) : body;
  const ret = new Response(text, {
    status: status || (error ? 500 : 200),
    headers,
  });
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
 * @param {Request} req The request
 * @param {Context} context The Context
 * @param {Object} params The action params.
 * @returns {Object} The pipeline action context.
 */
function extractActionContext(req, context, params) {
  const secrets = {
    ...context.env,
  };
  const disclosed = {};
  Object.entries(params).forEach(([key, value]) => {
    if (key.match(/^[A-Z0-9_]+$/)) {
      secrets[key] = value;
    } else {
      disclosed[key] = value;
    }
  });

  // setup action
  return {
    secrets,
    resolver: context.resolver,
    request: {
      params: disclosed,
      headers: req.headers.plain(),
      method: req.method,
    },
    logger: context.log,
  };
}

/**
 * Runs the given pipeline in the context of a universal Web-Action invocation.
 * @param {Function} cont The continuation function, aka the `once` function.
 * @param {Function} pipe A pipeline executor.
 * @param {Request} request The request
 * @param {Context} univContext The Context
 * @returns {Promise<Response>} The action response.
 */
async function runPipeline(cont, pipe, request, univContext) {
  async function runner(req, ctx) {
    const { searchParams } = new URL(req.url);
    const params = Array.from(searchParams.entries()).reduce((p, [key, value]) => {
      // eslint-disable-next-line no-param-reassign
      p[key] = value;
      return p;
    }, {});

    // create action context
    const action = extractActionContext(req, ctx, params);

    // context is initially empty
    // todo: think of adding the adaptOWRequestHere, too
    const context = {
      request: extractClientRequest(action),
    };
    return createActionResponse(await pipe(cont, context, action), action);
  }
  // enhance logger if trace method is missing (eg. a winston logger)
  if (univContext.log && !univContext.log.trace) {
    univContext.log.trace = univContext.log.silly;
  }

  return wrap(runner)
    .with(statusCheck)
    .with(logger.trace)
    .with(logger)(request, univContext);
}

module.exports = {
  runPipeline,
  extractActionContext,
  extractClientRequest,
  createActionResponse,
};
