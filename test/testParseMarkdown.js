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
const { logging } = require('@adobe/helix-testutils');
const parse = require('../src/html/parse-markdown');
const { assertMatch } = require('./markdown-utils');

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

function callback(body) {
  const dat = { content: { body } };
  parse(dat, { logger });
  return dat.content.mdast;
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

  it('Parses headings correctly', () => {
    assertMatch('headings', callback);
  });

  it('Parses HTML in Markdown', () => {
    assertMatch('forms', callback);
  });

  it('Does not get confused by thematic breaks', () => {
    assertMatch('confusing', callback);
  });

  it('Does not get confused by grayscale', () => {
    assertMatch('grayscale', callback);
  });

  it('Does not get confused by escaped links', () => {
    assertMatch('simple-links', callback);
  });
});

describe('Test Markdown Setting Context', () => {
  it('Sets default context objects', () => {
    const context = {};
    parse(context, { logger });
    assert.equal(typeof context.content, 'object');
    assert.equal(context.content.body, '');
    assert.equal(typeof context.request, 'object');
    assert.equal(context.request.extension, 'html');
  });

  it('Does not override values', () => {
    const context = {
      content: {
        body: 'custombody',
        extra: 'extraprop',
      },
      request: {
        extension: 'customext',
        extra: 'extraprop',
      },
    };
    parse(context, { logger });
    assert.equal(context.content.body, 'custombody');
    assert.equal(context.content.extra, 'extraprop');
    assert.equal(context.request.extension, 'customext');
    assert.equal(context.request.extra, 'extraprop');
  });

  it('Does handle empty extension case', () => {
    const context = {
      request: {
        extension: '',
      },
    };
    parse(context, { logger });
    assert.equal(context.request.extension, 'html');
  });
});

describe('Test MDAST position generation', () => {
  ['silly', 'trace', 'debug'].forEach((level) => {
    it(`keeps the position information if the logger is in '${level}' mode`, () => {
      const context = {
        content: { body: '# Hellow World' },
      };
      const action = {
        logger: logging.createTestLogger({ level }),
      };

      parse(context, action);

      assert.ok(context.content.mdast.position);
      assert.ok(context.content.mdast.children[0].position);
    });
  });

  ['verbose', 'info', 'warn', 'error', 'fatal'].forEach((level) => {
    it(`removes the position information if the logger is in '${level}' mode`, () => {
      const context = {
        content: { body: '# Hellow World' },
      };
      const action = {
        logger: logging.createTestLogger({ level }),
      };

      parse(context, action);

      assert.equal(context.content.mdast.position, undefined);
      assert.equal(context.content.mdast.children[0].position, undefined);
    });
  });
});
