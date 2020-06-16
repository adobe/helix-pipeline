/*
 * Copyright 2020 Adobe. All rights reserved.
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
const rewriteBlobImages = require('../src/html/rewrite-blob-images');

describe('Test Blob Image Rewriting', () => {
  it('Rewrites blob store image URLs', () => {
    const mdast = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures', 'image-example.json')).toString('utf-8'));
    const expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures', 'image-rewritten-example.json')).toString('utf-8'));

    const context = {
      content: { mdast },
    };
    rewriteBlobImages(context);
    assert.deepEqual(context.content.mdast, expected);
  });

  it('Does not throw error if mdast is missing', () => {
    rewriteBlobImages({
      content: {
        html: '<html></html>',
      },
    });
  });
});
