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
const builder = require('unist-builder');
const all = require('mdast-util-to-hast/lib/all');
const wrap = require('mdast-util-to-hast/lib/wrap');
const VDOMTransformer = require('../src/utils/mdast-to-vdom');

describe('Test VDOMTransformer#toHTML', () => {
  it('empty node', async () => {
    const html = VDOMTransformer.toHTML({ type: 'root' });
    assert.equal(html, '');
  });

  it('paragraph node', async () => {
    const html = VDOMTransformer.toHTML({
      type: 'root',
      children: [{
        type: 'paragraph',
        children: [{
          type: 'text',
          value: 'This is only a paragraph.',
        }],
      }],
    });
    assert.equal(html, '<p>This is only a paragraph.</p>');
  });

  it('image node', async () => {
    const html = VDOMTransformer.toHTML({
      type: 'root',
      children: [{
        type: 'image',
        url: 'url.html',
      }],
    });
    assert.equal(html, '<img src="url.html">');
  });

  it('h1 node', async () => {
    const html = VDOMTransformer.toHTML({
      type: 'root',
      children: [{
        type: 'heading',
        depth: 1,
        children: [{
          type: 'text',
          value: 'The title content',
        }],
      }],
    });
    assert.equal(html, '<h1>The title content</h1>');
  });

  it('complex node', async () => {
    const html = VDOMTransformer.toHTML({
      type: 'root',
      children: [{
        type: 'heading',
        depth: 1,
        children: [{
          type: 'text',
          value: 'The title content',
        }],
      }, {
        type: 'paragraph',
        children: [{
          type: 'text',
          value: 'This is a paragraph.',
        }],
      }, {
        type: 'image',
        url: 'url.html',
      }],
    });
    assert.equal(html, '<h1>The title content</h1>\n<p>This is a paragraph.</p>\n<img src="url.html">');
  });

  it('custom handler', async () => {
    const html = VDOMTransformer.toHTML({
      type: 'root',
      children: [{
        type: 'paragraph',
        children: [{
          type: 'text',
          value: 'This is only a paragraph.',
        }],
      }],
    }, {
      text: function text(h, node) {
        return h.augment(node, builder(node.type, node.value.toUpperCase()));
      },
    });
    assert.equal(html, '<p>THIS IS ONLY A PARAGRAPH.</p>');
  });

  it('multiple custom handlers', async () => {
    const html = VDOMTransformer.toHTML({
      type: 'root',
      children: [{
        type: 'list',
        ordered: true,
        children: [{
          type: 'listItem',
          children: [{
            type: 'text',
            value: 'Item 1',
          }],
        }, {
          type: 'listItem',
          children: [{
            type: 'text',
            value: 'Item 2',
          }],
        }],
      }],
    }, {
      list: function list(h, node) {
        const props = {};
        // just for the test, force ordering
        const name = 'ol';

        return h(node, name, props, wrap(all(h, node), true));
      },
      text: function text(h, node) {
        return h.augment(node, builder(node.type, node.value.toUpperCase()));
      },
    });
    assert.equal(html, '<ol>\n<li>ITEM 1</li>\n<li>ITEM 2</li>\n</ol>');
  });
});
