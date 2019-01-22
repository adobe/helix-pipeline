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
const emit = require('../src/html/emit-html');

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

describe('Test HTML emitter', () => {
  it('emitter works with empty document', () => {
    const out = emit({ content: { document: { body: {} } } }, { logger });
    assert.deepEqual(
      out, {
        content: {
          children: [],
          html: '',
        },
      },
    );
  });

  it('emitter transforms the given body', () => {
    const out = emit({
      content: {
        document: {
          body: {
            innerHTML: 'ab',
            firstChild: {
              childNodes: [{
                outerHTML: 'a',
              }, {
                outerHTML: 'b',
              }],
            },
          },
        },
      },
    }, { logger });
    assert.deepEqual(
      out, {
        content: {
          children: ['a', 'b'],
          html: 'ab',
        },
      },
    );
  });
});
