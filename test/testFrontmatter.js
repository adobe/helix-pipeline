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
const winston = require('winston');
const assert = require('assert');
const { cloneDeep } = require('lodash');
const yaml = require('js-yaml');
const { multiline } = require('@adobe/helix-shared').string;
const {
  flattenTree, concat, each,
} = require('ferrum');
const parseMd = require('../src/html/parse-markdown');
const parseFront = require('../src/html/parse-frontmatter');

const { FrontmatterParsingError } = parseFront;

let warning;

const logger = winston.createLogger({
  silent: true,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ],
});

const procMd = (md) => {
  const dat = { content: { body: multiline(md) } };
  parseMd(dat, { logger });
  const orig = cloneDeep(dat.content.mdast);
  parseFront(dat, { logger });
  return { orig, proc: dat.content.mdast };
};

const ck = (wat, md, ast) => {
  it(wat, () => {
    const { proc } = procMd(md);
    // Discard position info
    const nodes = flattenTree(proc,
      (node, recurse) => concat([node], recurse(node.children || [])));
    each(nodes, (node) => {
      delete node.position;
    });
    assert.deepStrictEqual(proc.children, yaml.safeLoad(ast));
  });
};

const ckNop = (wat, md) => {
  it(`${wat} should be ignored`, () => {
    const { proc, orig } = procMd(md);
    assert.deepStrictEqual(proc, orig);
  });
};

const ckErr = (wat, body) => {
  it(`${wat} should raise exception`, () => {
    procMd(body);
    assert.ok(warning instanceof FrontmatterParsingError, 'No Frontmatter Parsing Error logged');
  });
};

describe('parseFrontmatter', () => {
  beforeEach(() => {
    warning = undefined;

    logger.warn = (msg) => {
      warning = msg;
    };
  });

  // NOPs
  ckNop('Empty document', '');
  ckNop('Just some text', 'Foo');
  ckNop('Hash based second level header', '## Foo');
  ckNop('Underline second level header', `
    Hello World
    ---
  `);
  ckNop('Single <hr>', `
    ---
  `);
  ckNop('h2 with underline followed by <hr>', `
    Hello
    ---

    ---
  `);

  ckNop('diversity of h2 with underline and <hr>', `
    Hello
    ---

    Bar
    ---

    ---

    Bang
  `);

  ckNop('resolving ambiguity by using h2 underlined with 4 dashes', `
    Foo
    ----
    Hello
    ----
  `);

  ckNop('resolving ambiguity by using hr with spaces between dashes', `
    Foo
    - - -
    Hello
  `);

  ckNop('resolving ambiguity by using hr with spaces between dashes', `
    Foo

    - - -
    Hello: 13
    - - -

    Bar
  `);

  ckNop('resolving ambiguity by using hr with asterisk', `
    Foo
    ***
    Hello
  `);

  ckNop('resolving ambiguity by using hr with asterisk #2', `
    ***
    Foo: 42
    ***
  `);

  // actual warnings
  ckErr('reject invalid yaml', `
    ---
    - Foo
    hello: 42
    ---
  `);
  ckErr('reject yaml with list', `
    ---
    - Foo
    ---
  `);
  ckErr('reject yaml with json style list', `
    ---
    [1,2,3,4]
    ---
  `);
  ckErr('reject yaml with number', `
    ---
    42
    ---
  `);
  ckErr('reject yaml with string', `
    ---
    Hello
    ---
  `);
  ckErr('Reject yaml with null', `
    ---
    null
    ---
  `);
  ckErr('frontmatter with corrupted yaml', `
      Foo
      ---
      Bar: 42
      ---
    `);
  ckErr('frontmatter with insufficient space before it', `
      Foo
      ---
      Bar: 42
      ---
    `);
  ckErr('frontmatter with insufficient space after it', `
      ---
      Bar
      ---
      XXX
    `);
  ckErr('frontmatter with insufficient space on both ends', `
      ab: 33
      ---
      Bar: 22
      ---
      XXX: 44
    `);
  ckErr('frontmatter with empty line between paragraphs', `
      echo

      ---
      hello: 42

      world: 13
      ---

      delta
    `);
  ck('frontmatter at the start of the document with empty line', `
      ---
      hello: 42

      world: 13
      ---
    `, `
    - type: yaml
      payload:
        hello: 42
        world: 13
    `);

  ckErr('frontmatter in the middle of the document with empty line', `
    This is normal.

    Really normal stuff.

    ---
    hello: 42

    world: 13
    ---
  `);

  ck('frontmatter at the start of the document with empty line filled with space', `
      ---
      hello: 42

      world: 13
      ---
    `, `
    - type: yaml
      payload:
        hello: 42
        world: 13
    `);

  ckErr('frontmatter in the middle of the document with empty line filled with space', `
    This is normal.

    Really normal stuff.

    ---
    hello: 42

    world: 13
    ---
  `);
  // Good values

  ck('Entire doc is frontmatter', `
    ---
    foo: 42
    ---
  `, `
    - type: yaml
      payload:
        foo: 42
  `);

  ck('Entire doc is frontmatter w trailing space', `
    ---
    foo: 42
    ---
  `, `
    - type: yaml
      payload:
        foo: 42
  `);

  ck('Frontmatter; underline h2; frontmatter', `
    ---
    foo: 42
    ---

    Hello
    ---

    ---
    my: 42
    ---
  `, `
    - type: yaml
      payload:
        foo: 42
    - type: heading
      depth: 2
      children:
        - type: text
          value: Hello
    - type: yaml
      payload:
        my: 42
  `);

  ck('Frontmatter; underline h2; frontmatter; w trailing space', `
    ---
    foo: 42
    ---

    Hello
    ---

    ---
    my: 42
    ---
  `, `
    - type: yaml
      payload:
        foo: 42
    - type: heading
      depth: 2
      children:
        - type: text
          value: Hello
    - type: yaml
      payload:
        my: 42
  `);

  ck('frontmatter; frontmatter', `
    ---
    {x: 23}
    ---

    ---
    my: 42
    ---
  `, `
    - type: yaml
      payload:
        x: 23
    - type: yaml
      payload:
        my: 42
  `);
  ck('frontmatter, <hr>, frontmatter', `
    ---
    {x: 23}
    ---

    ---

    ---
    my: 42
    ---
  `, `
    - type: yaml
      payload:
        x: 23
    - type: thematicBreak
    - type: yaml
      payload:
        my: 42
  `);
  ck('frontmatter, text, frontmatter', `
    ---
    {x: 23}
    ---

    Hurtz

    ---
    my: 42
    ---
  `, `
    - type: yaml
      payload:
        x: 23
    - type: paragraph
      children:
        - type: text
          value: Hurtz
    - type: yaml
      payload:
        my: 42
  `);
  ck('frontmatter, <hr>, frontmatter, <hr>', `
    ---
    {x: 23}
    ---

    ---

    ---
    my: 42
    ---

    ---
  `, `
    - type: yaml
      payload:
        x: 23
    - type: thematicBreak
    - type: yaml
      payload:
        my: 42
    - type: thematicBreak
  `);
  ck('frontmatter, text, frontmatter, text, frontmatter, text, frontmatter, text', `
    ---
    {x: 23}
    ---

    Hurtz

    ---
    my: 42
    ---

    Bong

    ---
    nom: foo
    ---

    Huck

    ---
    nom: foo
    ---

    Huck



  `, `
    - type: yaml
      payload:
        x: 23
    - type: paragraph
      children:
        - type: text
          value: Hurtz
    - type: yaml
      payload:
        my: 42
    - type: paragraph
      children:
        - type: text
          value: Bong
    - type: yaml
      payload:
        nom: foo
    - type: paragraph
      children:
        - type: text
          value: Huck
    - type: yaml
      payload:
        nom: foo
    - type: paragraph
      children:
        - type: text
          value: Huck
  `);
});
