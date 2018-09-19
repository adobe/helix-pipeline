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
const fs = require('fs-extra');
const path = require('path');
const VDOM = require('../src/utils/mdast-to-vdom');

describe('Test MDAST to VDOM Transformation', () => {
  it('Simple MDAST Conversion', () => {
    const mdast = fs.readJSONSync(path.resolve(__dirname, 'fixtures', 'simple.json'));
    const transformer = new VDOM(mdast);
    const node = transformer.process();
    assert.equal(node.outerHTML, '<h1>Hello World</h1>');
  });

  it('Custom Text Matcher Conversion', () => {
    const mdast = fs.readJSONSync(path.resolve(__dirname, 'fixtures', 'simple.json'));
    const transformer = new VDOM(mdast);
    transformer.match('heading', () => '<h1>All Headings are the same to me</h1>');
    const node = transformer.process();
    assert.equal(node.outerHTML, '<h1>All Headings are the same to me</h1>');
  });
});
