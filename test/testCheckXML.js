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
const check = require('../src/xml/check-xml');

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

const context = {
  response: {
    headers: {
      'Content-Type': 'text/plain',
    },
    body: '<?xml version="1.0" encoding="utf-8"?><parent><child /></parent>',
  },
};

describe('Test check-xml', () => {
  it('validates proper XML', () => {
    check(context, { logger });
  });

  it('throws error on improper XML', () => {
    context.response.body = '<?xml version="1.0" encoding="utf-8"?><parent><child /></root>';
    try {
      check(context, { logger });
    } catch (e) {
      assert.ok(e);
    }
  });

  it('does nothing with empty response body', () => {
    context.response.body = '';
    check(context, { logger });
  });
});
