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
    const output = emit({ content, response }, action);
    assert.deepEqual(output.response.body, expectedJSON);
  });

  it('does nothing if no JSON object specified', () => {
    assert.deepEqual(emit({ content: {}, response }, action), {});
  });

  it('fails gracefully in case of invalid object', () => {
    // exclude element with illegal value
    assert.deepEqual(emit({
      content: {
        json: {
          with: {
            illegal: function elementValue() {},
          },
        },
      },
      response,
    }, action), {
      response: {
        body: {
          with: {},
        },
      },
    });
    // JSON.stringify does not like circular structures
    const obj = {};
    obj.a = { b: obj };
    assert.deepEqual(emit({
      content: {
        json: {
          foo: obj,
        },
      },
      response,
    }, action), { });
  });

  it('keeps existing response body', () => {
    response.body = expectedJSON;
    assert.deepEqual(emit({ content, response }, action), {});
  });

  it('handles missing response object', () => {
    const output = emit({ content }, action);
    assert.deepEqual(output.response.body, expectedJSON);
  });

  it('handles missing content object', () => {
    // no content object at all
    assert.deepEqual(emit({ response }, action), { });
  });
});
