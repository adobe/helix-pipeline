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

const fs = require('fs-extra');
const path = require('path');
const h = require('hyperscript');
const { Logger } = require('@adobe/helix-shared');
const { JSDOM } = require('jsdom');
const { assertEquivalentNode } = require('@adobe/helix-shared').dom;
const VDOM = require('../').utils.vdom;
const coerce = require('../src/utils/coerce-secrets');

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

const action = { logger };

const assertTransformerYieldsDocument = (transformer, expected) => {
  assertEquivalentNode(
    transformer.getDocument(),
    new JSDOM(expected).window.document,
  );

  assertEquivalentNode(
    transformer.getNode('section'),
    new JSDOM(`<section>${expected}</section>`).window.document.body.firstChild,
  );
};

describe('Test MDAST to VDOM Transformation', () => {
  before('Coerce defaults', async () => {
    await coerce(action);
  });

  it('Simple MDAST Conversion', () => {
    const mdast = fs.readJSONSync(path.resolve(__dirname, 'fixtures', 'simple.json'));
    assertTransformerYieldsDocument(
      new VDOM(mdast, action.secrets),
      '<h1>Hello World</h1>',
    );
  });

  it('Custom Text Matcher Conversion', () => {
    const mdast = fs.readJSONSync(path.resolve(__dirname, 'fixtures', 'simple.json'));
    const transformer = new VDOM(mdast, action.secrets);
    transformer.match('heading', () => '<h1>All Headings are the same to me</h1>');
    assertTransformerYieldsDocument(
      transformer,
      '<h1>All Headings are the same to me</h1>',
    );
  });

  it('Programmatic Matcher Function', () => {
    const mdast = fs.readJSONSync(path.resolve(__dirname, 'fixtures', 'simple.json'));
    const transformer = new VDOM(mdast, action.secrets);
    transformer.match(({ type }) => type === 'heading', () => '<h1>All Headings are the same to me</h1>');
    assertTransformerYieldsDocument(
      transformer,
      '<h1>All Headings are the same to me</h1>',
    );
  });

  it('Custom Text Matcher with Multiple Elements', () => {
    const mdast = fs.readJSONSync(path.resolve(__dirname, 'fixtures', 'simple.json'));
    const transformer = new VDOM(mdast, action.secrets);
    transformer.match('heading', () => '<a name="h1"></a><h1>All Headings are the same to me</h1>');
    assertTransformerYieldsDocument(
      transformer, `
      <div>
        <a name="h1"></a>
        <h1>All Headings are the same to me</h1>
      </div>`,
    );
  });

  it('Custom link handler with VDOM Nodes', () => {
    const mdast = fs.readJSONSync(path.resolve(__dirname, 'fixtures', 'links.json'));
    const transformer = new VDOM(mdast, action.secrets);
    transformer.match('link', (_, node) => {
      const res = h(
        'a',
        { href: node.url, rel: 'nofollow' },
        node.children.map(({ value }) => value),
      );
      return res;
    });
    assertTransformerYieldsDocument(
      transformer, `
        <ul>
          <li>
            <p>
              <code>body</code>: the unparsed content body as a <code>string</code>
            </p>
          </li>
          <li>
            <p><code>mdast</code>: the parsed <a href="https://github.com/syntax-tree/mdast" rel="nofollow">Markdown AST</a></p>
          </li>
          <li>
            <p><code>meta</code>: a map metadata properties, including</p>
            <ul>
              <li><code>title</code>: title of the document</li>
              <li><code>intro</code>: a plain-text introduction or description</li>
              <li><code>type</code>: the content type of the document</li>
            </ul>
          </li>
          <li>
            <p><code>htast</code>: the HTML AST</p>
          </li>
          <li>
            <p><code>html</code>: a string of the content rendered as HTML</p>
          </li>
          <li>
            <p><code>children</code>: an array of top-level elements of the HTML-rendered content</p>
          </li>
        </ul>`,
    );
  });

  it('Custom link handler does not interfere with link rewriting', () => {
    const mdast = fs.readJSONSync(path.resolve(__dirname, 'fixtures', 'paragraph.json'));
    const transformer = new VDOM(mdast, action.secrets);
    transformer.match('link[url^="http"]', (_, node) => {
      const res = h(
        'a',
        { href: node.url, rel: 'nofollow' },
        node.children.map(({ value }) => value),
      );
      return res;
    });
    assertTransformerYieldsDocument(
      transformer, `
        <p>
          <a href="https://house.md/syntax-tree/mdast.md"
              rel="nofollow">External link</a>:
            the parsed
            <a href="/mdast.html" title="My title">
              <img src="/dist/img/ipad.png" alt="ipad"
                   srcset="/dist/img/ipad.png?width=480&amp;auto=webp 480w,/dist/img/ipad.png?width=1384&amp;auto=webp 1384w,/dist/img/ipad.png?width=2288&amp;auto=webp 2288w,/dist/img/ipad.png?width=3192&amp;auto=webp 3192w,/dist/img/ipad.png?width=4096&amp;auto=webp 4096w"
                   sizes="100vw">
            </a>
        </p>`,
    );
  });
});
