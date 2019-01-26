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
const { assertMatch } = require('./markdown-utils');

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

function callback(body) {
  return parse({ content: { body } }, { logger }).content.mdast;
}

describe('Test Markdown Parsing', () => {
  it('Parses simple markdown', () => {
    assertMatch('simple', callback);
  });

  it('Parses example markdown', () => {
    assertMatch('example', callback);
  });

  it('Parses frontmatter markdown', () => {
    assertMatch('frontmatter', callback);
  });

  it('Does not get confused by thematic breaks', () => {
    assertMatch('confusing', callback);
  });

  it('Does not get confused by grayscale', () => {
    assertMatch('grayscale', callback);
  });
});
