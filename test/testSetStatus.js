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
const setStatus = require('../src/html/set-status.js');

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

describe('Test set-status', () => {
  it('sets a 500 for an error', () => {
    assert.deepEqual(
      setStatus({ content: { html: '<html></html>' }, error: 'oh, no!' }, { logger }),
      {
        response: {
          status: 500,
          body: '',
        },
      },
    );
  });

  it('keeps an existing status', () => {
    assert.deepEqual(
      setStatus({
        response: {
          status: 201,
        },
      }, { logger }),
      {},
    );
  });

  it('sets a 200 if all good', () => {
    assert.deepEqual(
      setStatus({ content: { html: '<html></html>' } }, { logger }),
      {
        response: {
          status: 200,
        },
      },
    );
  });
});
