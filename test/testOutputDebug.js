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
const { logging } = require('@adobe/helix-testutils');
const { deepclone } = require('ferrum');
const _ = require('lodash');
const debug = require('../src/html/output-debug');

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

describe('Test outputDebug', () => {
  function getContext() {
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

  function computeExpectedOutput(context) {
    const p = _.merge({}, context);
    const { body } = p.response;
    delete p.response.body;
    const debugScript = debug.DEBUG_TEMPLATE.replace(/CONTEXT_JSON/, JSON.stringify(p));
    p.response.body = body.replace(/<\/body>/i, `${debugScript}</body>`);
    return p;
  }

  it('Testing no debug', () => {
    const context = getContext();
    context.request.params.debug = false;
    debug(context, { logger });
    assert.deepEqual(context, deepclone(context));
  });

  it('Testing simple context', () => {
    const context = getContext();
    const expected = computeExpectedOutput(context);
    debug(context, { logger });
    assert.deepEqual(context, expected);
  });

  it('Testing upper case body tag', () => {
    const context = getContext();
    context.response.body = context.response.body.toUpperCase();
    const expected = computeExpectedOutput(context);
    debug(context, { logger });
    assert.deepEqual(context, expected);
  });
});
