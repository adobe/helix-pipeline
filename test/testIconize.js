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
const { Logger } = require('@adobe/helix-shared');
const parse = require('../src/html/parse-markdown');
const iconize = require('../src/html/iconize');
const { assertMatch } = require('./markdown-utils');

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

function callback(body) {
  const data = { content: { body } };
  parse(data, { logger });
  iconize(data, { logger });
  return data.content.mdast;
}

describe('Test Iconize Processing', () => {
  it('Parses markdown with icons', () => {
    for (let i = 0; i < 50; i += 1) {
      assertMatch('icon-example', callback);
    }
  });

  it('does not throw error if mdast is missing', () => {
    iconize({
      content: {
        html: '<html></html>',
      },
    });
  });
});
