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
const { deepclone } = require('@adobe/helix-shared').types;
const emit = require('../src/json/emit-json');

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

const content = {
  json: {
    root: {
      title: 'Bill, Welcome to the future',
    },
  },
};
const response = {};
const action = {
  logger,
};

const expectedJSON = Object.assign({}, content.json);

describe('Test emit-json', () => {
  it('builds JSON from object', () => {
    const dat = deepclone({ content, response });
    emit(dat, action);
    assert.deepEqual(dat.response.body, expectedJSON);
  });

  it('does nothing if no JSON object specified', () => {
    const dat = deepclone({ content: {}, response });
    emit(dat, action);
    assert(dat, { content: {}, response });
  });

  it('keeps existing response body', () => {
    response.body = expectedJSON;
    const dat = deepclone({ content, response });
    emit(dat, action);
    assert.deepEqual(dat, { content, response });
  });

  it('handles missing response object', () => {
    const dat = deepclone({ content });
    emit(dat, action);
    assert.deepEqual(dat.response.body, expectedJSON);
  });

  it('handles missing content object', () => {
    // no content object at all
    const dat = deepclone({ response });
    emit(dat, action);
    assert.deepEqual(dat, { response, content: {} });
  });
});
