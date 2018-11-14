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
const image = require('../src/utils/image-handler');

describe('Test Image Handler', () => {
  it('Does not modify absolute URLs', () => {
    const node = {
      type: 'image',
      alt: 'Just an image',
      url: 'https://www.example.com/test.png',
    };

    image()((orignode, tagname, params, children) => {
      assert.equal(params.src, orignode.url);
      assert.equal(children, undefined);
      assert.equal(tagname, 'img');
    }, node);
  });

  it('Injects Source Sets for Relative URLs', () => {
    const node = {
      type: 'image',
      alt: 'Just an image',
      url: 'test.png',
      title: 'Foo Bar',
    };

    image()((orignode, tagname, params, children) => {
      assert.equal(params.src, orignode.url);
      assert.equal(children, undefined);
      assert.equal(tagname, 'img');
      assert.equal(params.srcset, 'test.png?width=480&auto=webp 480w'
        + ',test.png?width=1384&auto=webp 1384w'
        + ',test.png?width=2288&auto=webp 2288w'
        + ',test.png?width=3192&auto=webp 3192w'
        + ',test.png?width=4096&auto=webp 4096w');
    }, node);
  });

  it('Allows overriding Image Options', () => {
    const node = {
      type: 'image',
      alt: 'Just an image',
      url: 'test.png',
    };

    image({
      IMAGES_MIN_SIZE: 100,
      IMAGES_MAX_SIZE: 300,
      IMAGES_SIZE_STEPS: 1,
    })((orignode, tagname, params, children) => {
      assert.equal(params.src, orignode.url);
      assert.equal(children, undefined);
      assert.equal(tagname, 'img');
      assert.equal(params.srcset, 'test.png?width=100&auto=webp 100w'
        + ',test.png?width=200&auto=webp 200w'
        + ',test.png?width=300&auto=webp 300w');
    }, node);
  });
});
