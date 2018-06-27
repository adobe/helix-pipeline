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

/**
 * Constructs a pipeline function that is capable of
 * - reading OpenWhisk parameters
 * - calling a continuation function
 * - wrapping the response in a friendly response format
 * @param {Function} cont the continuation function
 * @param {Object} params the OpenWhisk parameters
 * @returns {Function} a function to execute.
 */
module.exports.pipe = cont => params => cont(params);

/**
 *
 * @param {Function} cont the continuation function
 * @param {Object} params the OpenWhisk parameters
 * @returns {Function} the wrapped main function
 */
module.exports.pre = cont => cont;

/**
 * A standard cleanup function that takes OpenWhisk-style parameters and turns
 * them into an Express-style request object which is returned.
 * @param {Object} params Parameters following OpenWhisk convention, including
 * __ow_method and __ow_headers for HTTP requests
 * @returns {Object} A req object that is equivalent to an Express request object,
 * including a headers, method, and params field
 */
module.exports.before = (params) => {
  // use destructuring to drop __ow_headers and __ow_method from params
  /* eslint camelcase: "off" */
  /* eslint no-underscore-dangle: "off" */
  const { __ow_headers, __ow_method, ...newparams } = params;

  return {
    request: {
      headers: params.__ow_headers,
      params: newparams,
      method: params.__ow_method,
    },
  };
};

module.exports.after = (params) => {
  const { response: { status = 200, headers = { 'Content-Type': 'application/json' }, body = '' } } = params;
  return {
    statusCode: status,
    headers,
    body,
  };
};

module.exports.log = winston.createLogger({
  level: 'debug',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'pipeline.log' }),
  ],
});
