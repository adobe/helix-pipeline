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
/* eslint-env mocha */
const assert = require('assert');
const winston = require('winston');
const _ = require('lodash');
const debug = require('../src/html/output-debug');

const logger = winston.createLogger({
  // tune this for debugging
  level: 'debug',
  // and turn this on if you want the output
  silent: true,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

describe('Test outputDebug', () => {
  function getPayload() {
    return {
      request: {
        params: {
          debug: true,
        },
      },
      response: {
        body: '<html><body></body></html>',
      },
    };
  }

  function computeExpectedOutput(payload) {
    const p = _.merge({}, payload);
    const { body } = p.response;
    delete p.response.body;
    const debugScript = debug.DEBUG_TEMPLATE.replace(/PAYLOAD_JSON/, JSON.stringify(p));
    p.response.body = body.replace(/<\/body>/i, `${debugScript}</body>`);
    return p;
  }

  it('Testing no debug', () => {
    const payload = getPayload();
    payload.request.params.debug = false;
    assert.deepEqual(debug(payload, { logger }), payload);
  });

  it('Testing simple payload', () => {
    const payload = getPayload();
    const expected = computeExpectedOutput(payload);
    assert.deepEqual(debug(payload, { logger }), expected);
  });

  it('Testing upper case body tag', () => {
    const payload = getPayload();
    payload.response.body = payload.response.body.toUpperCase();
    const expected = computeExpectedOutput(payload);
    assert.deepEqual(debug(payload, { logger }), expected);
  });

});
