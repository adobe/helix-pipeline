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
import { logging } from '@adobe/helix-testutils';
import parse from '../src/html/parse-markdown.js';
import iconize from '../src/html/iconize.js';
import { assertMatch, assertValid } from './markdown-utils.js';

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

function callback(body) {
  const data = { content: { body } };
  parse(data, { logger });
  iconize(data, { logger });
  return data.content.mdast;
}

function context(body) {
  const dat = {
    content: {
      body,
      mdast: callback(body),
    },
  };
  return dat;
}

describe('Test Iconize Processing', () => {
  it('Markdown with icons yields valid context', (done) => {
    assertValid('icon-example', context, done);
  });

  it('Parses markdown with icons', () => {
    assertMatch('icon-example', callback);
  });

  it('Does not throw error if mdast is missing', () => {
    iconize({
      content: {
        html: '<html></html>',
      },
    });
  });
});
