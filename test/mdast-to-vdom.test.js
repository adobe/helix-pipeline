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

import fs from 'fs-extra';
import path from 'path';
import { h } from 'hastscript';
import hy from 'hyperscript';
import assert from 'assert';
import { logging } from '@adobe/helix-testutils';
import { assertEquivalentNode } from '@adobe/helix-shared-dom';
import { JSDOM } from 'jsdom';
import { unified } from 'unified';
import parser from 'remark-parse';
import { utils } from '../index.js';
import coerce from '../src/utils/coerce-secrets.js';

const VDOM = utils.vdom;
const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

const action = { logger };

const assertTransformerYieldsDocument = (transformer, expected) => {
  // check equality of the dom, but throw assertion based on strings to visualize difference.
  const act = transformer.getDocument();
  const dom = new JSDOM(expected);
  assertEquivalentNode(act, dom.window.document);
};

describe('Test MDAST to VDOM Transformation', () => {
  before('Coerce defaults', async () => {
    await coerce(action);
  });

  it('Simple MDAST Conversion', () => {
    const mdast = fs.readJSONSync(path.resolve(__testdir, 'fixtures', 'simple.json'));
    assertTransformerYieldsDocument(
      new VDOM(mdast, action.secrets), // .withOptions(action.secrets),
      '<h1 id="hello-world">Hello World</h1>',
    );
  });

  it('Headings MDAST Conversion', () => {
    const mdast = fs.readJSONSync(path.resolve(__testdir, 'fixtures', 'heading-ids.json'));
    assertTransformerYieldsDocument(
      new VDOM(mdast, action.secrets),
      `
      <h1 id="foo">Foo</h1>
      <h2 id="bar">Bar</h2>
      <h3 id="baz">Baz</h1>
      <h2 id="qux">Qux</h2>
      <h3 id="bar-1">Bar</h3>
      <h4 id="bar-1-1">Bar-1</h4>
      <h1 id="foo-bar-baz"><strong>Foo</strong> <em>Bar</em> <code>Baz</code></h1>`,
    );
  });

  it('Sections MDAST Conversion', () => {
    const mdast = fs.readJSONSync(path.resolve(__testdir, 'fixtures', 'headings.json'));
    assertTransformerYieldsDocument(
      new VDOM(mdast, action.secrets),
      `
      <h1 id="heading-1-double-underline">Heading 1 (double-underline)</h1>
      <h2 id="heading-2-single-underline">Heading 2 (single-underline)</h2>
      <h1 id="heading-1">Heading 1</h1>
      <h2 id="heading-2">Heading 2</h2>
      <h3 id="heading-3">Heading 3</h3>
      <h4 id="heading-4">Heading 4</h4>
      <h5 id="heading-5">Heading 5</h5>
      <h6 id="heading-6">Heading 6</h6>`,
    );
  });

  it('Custom Text Matcher Conversion', () => {
    const mdast = fs.readJSONSync(path.resolve(__testdir, 'fixtures', 'simple.json'));
    const transformer = new VDOM(mdast, action.secrets);
    transformer.match('heading', () => h('h1', 'All Headings are the same to me'));
    assertTransformerYieldsDocument(
      transformer,
      '<h1>All Headings are the same to me</h1>',
    );
  });

  it('Programmatic Matcher Function', () => {
    const mdast = fs.readJSONSync(path.resolve(__testdir, 'fixtures', 'simple.json'));
    const transformer = new VDOM(mdast, action.secrets);
    transformer.match(({ type }) => type === 'heading', () => h('h1', 'All Headings are the same to me'));
    assertTransformerYieldsDocument(
      transformer,
      '<h1>All Headings are the same to me</h1>',
    );
  });

  it('Custom Text Matcher with Multiple Elements', () => {
    const mdast = fs.readJSONSync(path.resolve(__testdir, 'fixtures', 'simple.json'));
    const transformer = new VDOM(mdast, action.secrets);
    transformer.match('heading', () => [h('a', { name: 'h1' }), h('h1', 'All Headings are the same to me')]);
    assertTransformerYieldsDocument(
      transformer,
      `
          <a name="h1"></a>
          <h1>All Headings are the same to me</h1>
        `,
    );
  });

  it('Custom Matcher returns string fails', () => {
    const mdast = fs.readJSONSync(path.resolve(__testdir, 'fixtures', 'simple.json'));
    const transformer = new VDOM(mdast, action.secrets);
    transformer.match('heading', () => '<h1>All Headings are the same to me</h1>');
    try {
      assertTransformerYieldsDocument(
        transformer,
        `
          <a name="h1"></a>
          <h1>All Headings are the same to me</h1>
        `,
      );
      assert.fail();
    } catch (e) {
      assert.equal(e.message, 'returning string from a handler is not supported yet.');
    }
  });

  it('Custom Matcher returns vdom fails', () => {
    const mdast = fs.readJSONSync(path.resolve(__testdir, 'fixtures', 'simple.json'));
    const transformer = new VDOM(mdast, action.secrets);
    transformer.match('heading', () => hy('div'));
    try {
      assertTransformerYieldsDocument(
        transformer,
        `
          <a name="h1"></a>
          <h1>All Headings are the same to me</h1>
        `,
      );
      assert.fail();
    } catch (e) {
      assert.equal(e.message, 'returning a DOM element from a handler is not supported yet.');
    }
  });

  it('Custom link handler with VDOM Nodes', () => {
    const mdast = fs.readJSONSync(path.resolve(__testdir, 'fixtures', 'links.json'));
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
      transformer,
      `
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
    const mdast = fs.readJSONSync(path.resolve(__testdir, 'fixtures', 'paragraph.json'));
    const transformer = new VDOM(mdast, action.secrets);
    transformer.match('link[url^="http"]', (_, node) => h(
      'a',
      { href: node.url, rel: 'nofollow' },
      node.children.map(({ value }) => value),
    ));
    assertTransformerYieldsDocument(
      transformer,
      `
        <p>
          <a href="https://house.md/syntax-tree/mdast.md"
              rel="nofollow">External link</a>:
            the parsed
            <a href="/mdast.html" title="My title">
              <img src="/dist/img/ipad.png" alt="ipad">
            </a>
        </p>`,
    );
  });

  it('Icon handler replaces icon :placeholders:', () => {
    const mdast = fs.readJSONSync(path.resolve(__testdir, 'fixtures', 'icon-example.json'));
    const actual = new VDOM(mdast, action.secrets).getDocument().documentElement;
    const expected = new JSDOM(fs.readFileSync(path.resolve(__testdir, 'fixtures', 'icon-example.html')).toString('utf-8')).window.document.documentElement;
    assert.deepEqual(actual.outerHTML, expected.outerHTML);
  });

  it('creating nested list is performant', () => {
    const markdown = fs.readFileSync(path.resolve(__testdir, 'fixtures', 'tags.md'));
    const mdast = unified().use(parser).parse(markdown);
    const doc = new VDOM(mdast, action.secrets).getDocument();
    const actual = doc.documentElement.innerHTML;
    const expected = new JSDOM(fs.readFileSync(path.resolve(__testdir, 'fixtures', 'tags.html')).toString('utf-8')).window.document.documentElement.innerHTML;
    assert.deepEqual(actual.outerHTML, expected.outerHTML);
  });
});
