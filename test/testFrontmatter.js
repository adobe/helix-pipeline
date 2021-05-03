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
const yaml = require('js-yaml');
const { multiline } = require('@adobe/helix-shared-string');
const { SimpleInterface, ConsoleLogger } = require('@adobe/helix-log');
const {
  flattenTree, concat, each,
} = require('ferrum');
const unified = require('unified');
const remark = require('remark-parse');
const gfm = require('remark-gfm');
const parseMd = require('../src/html/parse-markdown');

const { FrontmatterParsingError } = parseMd;

let warning;

const logger = new SimpleInterface({ logger: new ConsoleLogger() });

const procMd = (md) => {
  const dat = { content: { body: multiline(md) } };

  // parse w/o frontmatter plugin
  const orig = unified()
    .use(remark)
    .use(gfm)
    .parse(dat.content.body);

  parseMd(dat, { logger });
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
    assert.deepStrictEqual(proc.children, yaml.load(ast));
  });
};

const ckNop = (wat, md) => {
  it(`${wat} should be ignored`, () => {
    const { proc, orig } = procMd(md);
    assert.deepEqual(proc, orig);
    assert.equal(warning, undefined, 'Unexpected frontmatter parsing error logged.');
  });
};

const ckErr = (wat, md) => {
  it(`${wat} should log a warning`, () => {
    const { proc, orig } = procMd(md);
    assert.deepEqual(proc, orig);
    assert.ok(warning instanceof FrontmatterParsingError, 'expected frontmatter parsing error logged');
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

  ckNop('no frontmatter due to empty lines', `
    # Multimedia Test
    ---
    ![](https://hlx.blob.core.windows.net/external/20f9d6dff67514da262230822bda5f3b50ef28c6#image.png)
    ---
    PUBLISHED ON 28-04-2020
    ---
    
    ### SlideShare

    <https://www.slideshare.net/adobe/adobe-digital-insights-holiday-recap-2019>
    
    ---
    Topics: Bar, Baz
    Products: Stock, Creative Cloud
  `);

  ckNop('no frontmatter with embeds', `
    ---
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ78BeYUV4gFee4bSxjN8u86aV853LGYZlwv1jAUMZFnPn5TnIZteDJwjGr2GNu--zgnpTY1E_KHXcF/pubhtml
    
    Is foo {{foo}}?"
    ---
  `);

  // actual warnings
  ckNop('reject invalid yaml', `
    ---
    - Foo
    hello: 42
    ---
  `);
  ckNop('reject yaml with list', `
    ---
    - Foo
    ---
  `);
  ckErr('reject yaml with json style list', `
    ---
    [1,2,3,4]
    ---
  `);
  ckNop('reject yaml with number', `
    ---
    42
    ---
  `);
  ckNop('reject yaml with string', `
    ---
    Hello
    ---
  `);
  ckErr('Reject yaml with null', `
    ---
    null
    ---
  `);
  ckNop('frontmatter with insufficient space before it', `
      Foo
      ---
      Bar: 42
      ---
    `);
  ckNop('frontmatter with insufficient space after it', `
      ---
      Bar
      ---
      XXX
    `);
  ckNop('frontmatter with insufficient space on both ends', `
      ab: 33
      ---
      Bar: 22
      ---
      XXX: 44
    `);
  ckNop('section with emoticons', `
---

:normal:

---

- [home](#)
- [menu](#menu)
    `);
  ckNop('just sections', `
# Title

---

Lorem ipsum 1

---

Lorem ipsum 2

---

Lorem ipsum 3
    `);
  ckNop('frontmatter with empty line between paragraphs', `
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

  ckNop('frontmatter in the middle of the document with empty line', `
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

  ckNop('frontmatter in the middle of the document with empty line filled with space', `
    This is normal.

    Really normal stuff.

    ---
    hello: 42

    world: 13
    ---
  `);
  // Good values

  ckNop('trieloff/helix-demo/foo.md',
    `---
title: Foo bar hey.

---
# More?
`);

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
