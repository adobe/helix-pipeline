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
const check = require('../src/xml/check-xml');

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

const payload = {
  response: {
    headers: {
      'Content-Type': 'text/plain',
    },
    body: '<?xml version="1.0" encoding="utf-8"?><parent><child /></parent>',
  },
};

describe('Test check-xml', () => {
  it('validates proper XML', () => {
    check(payload, { logger });
  });

  it('throws error on improper XML', () => {
    payload.response.body = '<?xml version="1.0" encoding="utf-8"?><parent><child /></root>';
    try {
      check(payload, { logger });
    } catch (e) {
      assert.ok(e);
    }
  });

  it('does nothing with empty response body', () => {
    payload.response.body = '';
    check(payload, { logger });
  });
});
