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
const { deepclone } = require('ferrum');
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

const context = {
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
    const data = deepclone(context);
    emit(data, action);
    assert.deepEqual(data.response.body, expectedXML);
  });

  it('builds pretty XML from object', () => {
    const data = deepclone(context);
    action.secrets.XML_PRETTY = true;
    emit(data, action);
    assert.deepEqual(data.response.body, expectedPrettyXML);
    action.secrets.XML_PRETTY = false;
  });

  it('does nothing if no XML object specified', () => {
    const data = { content: {}, response: {} };
    emit(data, action);
    assert.deepEqual(data, { content: {}, response: {} });
  });

  it('keeps existing response body', () => {
    context.response.body = expectedXML;
    const data = deepclone(context);
    emit(data, action);
    assert.deepEqual(data, context);
  });

  it('handles missing response object', () => {
    const data = { content };
    emit(data, action);
    assert.deepEqual(data.response.body, expectedXML);
  });
});
