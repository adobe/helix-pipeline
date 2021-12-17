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
import assert from 'assert';
import { logging } from '@adobe/helix-testutils';
import type from '../src/html/set-content-type.js';

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

const context = {
  response: {
    headers: {
      'Content-Type': 'text/plain',
    },
  },
};

describe('Test set-content-type', () => {
  it('is a function', () => {
    assert.equal(typeof type('foo/bar'), 'function');
  });

  it('sets a content type', () => {
    const data = {};
    type('text/html')(data, { logger });
    assert.strictEqual(data.response.headers['Content-Type'], 'text/html');
  });

  it('keeps existing content type', () => {
    type('text/html')(context, { logger });
    assert.strictEqual(context.response.headers['Content-Type'], 'text/plain');
  });
});
