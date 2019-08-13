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
const { Logger } = require('@adobe/helix-shared');
const selectStatus_ = require('../src/html/set-status.js');

const selectStatus = (inProduction) => (context, env) => {
  // Mocking whether we are in production or not
  const old = process.env.__OW_ACTIVATION_ID;
  try {
    process.env.__OW_ACTIVATION_ID = inProduction ? 'mocked' : '';
    selectStatus_(context, env);
    return context;
  } finally {
    process.env.__OW_ACTIVATION_ID = old;
  }
};

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

describe('Test set-status', () => {
  const error = 'oh, no!';

  it('sets a verbose 500 for an error in dev', () => {
    const data = selectStatus(false)({ content: { html: '<html></html>' }, error }, { logger });
    assert.strictEqual(data.response.status, 500);
    assert.strictEqual(data.response.body, `<html><body><h1>500</h1><pre>${error}</pre></body></html>`);
    assert.strictEqual(data.response.headers['Content-Type'], 'text/html');
  });

  it('sets a terse 500 for an error in production', () => {
    const data = selectStatus(true)({ content: { html: '<html></html>' }, error }, { logger });
    assert.strictEqual(data.response.status, 500);
    assert.strictEqual(data.response.body, '');
  });

  it('keeps an existing status', () => {
    const data = selectStatus(true)({ response: { status: 201 } }, { logger });
    assert.strictEqual(data.response.status, 201);
  });

  it('sets a 200 if all good', () => {
    const data = selectStatus(true)({ content: { html: '<html></html>' } }, { logger });
    assert.strictEqual(data.response.status, 200);
  });
});
