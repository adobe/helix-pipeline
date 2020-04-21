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
const { logging } = require('@adobe/helix-testutils');
const parse = require('../src/html/parse-markdown');
const split = require('../src/html/split-sections');
const { assertMatch } = require('./markdown-utils');

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

function callback(body) {
  const data = { content: { body } };
  parse(data, { logger });
  split(data, { logger });
  return data.content.mdast.children;
}

describe('Test Section Splitting', () => {
  it('Parses markdown with sections', () => {
    assertMatch('sections', callback);
  });
});
