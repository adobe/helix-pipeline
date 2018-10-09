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
const owwrapper = require('@adobe/openwhisk-loggly-wrapper');

/**
 * A function that takes OpenWhisk-style req parameter and turns
 * it into the original Express-style request object which is returned.
 * @param {Object} action The pipeline action context
 * @return {Object} an express style request object.
 */
function extractClientRequest(action) {
  const { request } = action;
  try { // the edge encodes the client request parameters into the `params` param ;-)
    if (!request || !request.params) {
      return {};
    }
    if (request.params.params) {
      return {
        params: querystring.parse(request.params.params),
        headers: request.headers,
        method: request.method,
      };
    }
    // alternatively it can encode the entire request as json
    if (request.params.req) {
      return JSON.parse(request.params.req);
    }
    return {};
  } catch (e) {
    throw Error(`Error while parsing incoming request parameter: ${e.message}`);
  }
}

/**
 * Creates an response for the OpenWhisk Web-Action from the pipeline payload.
 * @param {Object} payload Pipeline payload.
 * @returns {Object} OpenWhisk response
 */
async function createActionResponse(payload) {
  const {
    response: {
      status = 200,
      headers = { 'Content-Type': 'application/json' },
      body = headers['Content-Type'] === 'application/json' ? {} : '',
      error,
    } = {},
  } = payload;
  return {
    statusCode: status,
    headers,
    body,
    error,
  };
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

  // setup action
  return {
    secrets,
    request: {
      params: disclosed,
      headers: __ow_headers,
      method: __ow_method,
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

    // payload is initially empty
    // todo: think of adding the adaptOWRequestHere, too
    const payload = {
      request: extractClientRequest(action),
    };
    return pipe(cont, payload, action);
  }
  return createActionResponse(await owwrapper(runner, actionParams));
}

module.exports = {
  runPipeline,
  extractClientRequest,
  createActionResponse,
};
