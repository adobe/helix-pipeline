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
const emit = require('../src/xml/emit-xml');

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

const content = {
  xml: {
    document: {
      title: {
        '#text': 'Bill, Welcome to the future',
        '@level': 1,
      },
    },
  },
};

const payload = {
  content,
  response: {},
};

const action = {
  secrets: { },
  logger,
};

const expectedXML = '<?xml version="1.0" encoding="utf-8"?><document><title level="1">Bill, Welcome to the future</title></document>';
const expectedPrettyXML = '<?xml version="1.0" encoding="utf-8"?>\n<document>\n  <title level="1">Bill, Welcome to the future</title>\n</document>';

describe('Test emit-xml', () => {
  it('builds XML from object', () => {
    const output = emit(payload, action);
    assert.deepEqual(output.response.body, expectedXML);
  });

  it('builds pretty XML from object', () => {
    action.secrets.XML_PRETTY = true;
    const output = emit(payload, action);
    assert.deepEqual(output.response.body, expectedPrettyXML);
    action.secrets.XML_PRETTY = false;
  });

  it('does nothing if no XML object specified', () => {
    assert.deepEqual(emit({ content: {}, response: {} }, action), {});
  });

  it('fails gracefully in case of invalid object', () => {
    // xml contains unexpected value which will break xmlbuilder-js
    assert.deepEqual(emit({ content: { xml: function bla() {} }, response: {} }, action), {});
  });

  it('keeps existing response body', () => {
    payload.response.body = expectedXML;
    assert.deepEqual(emit(payload, action), {});
  });

  it('handles missing response object', () => {
    const output = emit({ content }, action);
    assert.deepEqual(output.response.body, expectedXML);
  });
});
