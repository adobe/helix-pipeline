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
const pattern = require('../src/utils/pattern-compiler');

describe('Test compiled patterns', () => {
  it('Basic pattern matches', () => {
    assert.ok(pattern.match(['heading', 'paragraph', 'paragraph'], 'heading? paragraph+'));
    assert.ok(!pattern.match(['heading', 'paragraph'], 'heading? paragraph paragraph+'));
  });

  it('Or expressions work', () => {
    assert.ok(pattern.match(['heading', 'image', 'paragraph'], '^heading? (paragraph|image)+'));
    assert.ok(pattern.match(['heading', 'paragraph', 'image'], 'heading? (paragraph|image)+'));
  });

  it('Matches a gallery', () => {
    const gallery = '^heading? image image image+$';
    assert.ok(pattern.match(
      ['heading', 'image', 'image', 'image', 'image'],
      gallery,
    ));
    assert.ok(pattern.match(
      ['heading', 'image', 'image', 'image', 'image', 'image'],
      gallery,
    ));
    assert.ok(pattern.match(
      ['image', 'image', 'image', 'image'],
      gallery,
    ));
  });

  it('Matches a section with text or lists', () => {
    const textlist = '^heading? (paragraph|list)+$';
    assert.ok(pattern.match(
      ['heading', 'list', 'list', 'list', 'list'],
      textlist,
    ));
    assert.ok(pattern.match(
      ['heading', 'paragraph', 'paragraph', 'list', 'paragraph', 'paragraph'],
      textlist,
    ));
    assert.ok(pattern.match(
      ['paragraph', 'list', 'paragraph', 'list'],
      textlist,
    ));
  });
});
