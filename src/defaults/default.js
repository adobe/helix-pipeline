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
const winston = require('winston');
const Pipeline = require('../pipeline.js');

/**
 * Constructs a pipeline function that is capable of
 * - reading OpenWhisk parameters
 * - calling a continuation function
 * - wrapping the response in a friendly response format
 * @param {Function} next the continuation function
 * @param {Object} payload the initial payload
 * @param {Object} action the Openwhish action
 * @returns {Function} a function to execute.
 */
function pipe(next, payload, action) {
  const mypipeline = new Pipeline(action);
  mypipeline.once(next);
  return mypipeline.run(payload);
}

/**
 *
 * @param {Function} cont the continuation function
 * @returns {Function} the wrapped main function
 */
const pre = cont => cont;

/**
 * A function that takes OpenWhisk-style req parameter and turns
 * it into the original Express-style request object which is returned.
 * @param {Object} payload Pipeline payload
 * @param {Object} action Object representing the OpenWhisk action, including
 * the request, __ow_method and __ow_headers for HTTP requests and secrets
 * @returns {Object} The original req object that is equivalent to an Express request object,
 * including a headers, method, and params field
 */
function adaptOWRequest(payload, { logger, request: { params: { req = '{}' } } }) {
  try {
    return {
      request: JSON.parse(req),
    };
  } catch (e) {
    const out = logger || console;
    out.error(`Cannot parse incoming request parameter: ${e.stack}`);
    return {
      request: {},
    };
  }
}

function adaptOWResponse(payload) {
  const {
    response: {
      status = 200,
      headers = { 'Content-Type': 'application/json' },
      body = '',
    },
  } = payload;
  return {
    statusCode: status,
    headers,
    body,
  };
}

const log = winston.createLogger({
  level: 'debug',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'pipeline.log' }),
  ],
});

const defaults = {
  pipe,
  pre,
  adaptOWRequest,
  adaptOWResponse,
  log,
};

module.exports = defaults;
