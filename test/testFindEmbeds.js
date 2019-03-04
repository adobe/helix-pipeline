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
const embeds = require('../src/html/find-embeds');
const { assertMatch, assertValid } = require('./markdown-utils');
const coerce = require('../src/utils/coerce-secrets');

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

const action = {
  logger,
};

function mdast(body) {
  const parsed = parse({ content: { body } }, { logger });
  return embeds(parsed, action).content.mdast;
}

function context(body) {
  const parsed = parse({ content: { body } }, { logger });
  return embeds(parsed, action);
}

describe('Test Embed Detection Processing', () => {
  before('Coerce defaults', async () => {
    await coerce(action);
  });

  it('Parses markdown with embeds', () => {
    assertMatch('embeds', mdast);
  });
});

describe('Validate Embed Examples In Pipeline', () => {
  it('Markdown with embeds yields valid context', (done) => {
    assertValid('embeds', context, done);
  });
});
