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
const { Logger } = require('@adobe/helix-shared');
const parse = require('../src/html/parse-markdown');
const split = require('../src/html/split-sections');
const parseFront = require('../src/html/parse-frontmatter');
const { assertMatchDir } = require('./markdown-utils');
const getmetadata = require('../src/html/get-metadata');

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

function callback(body) {
  const dat = { content: { body } };
  parse(dat, { logger });
  parseFront(dat);
  split(dat, { logger });
  getmetadata(dat, { logger });
  return dat.content.mdast;
}

const SECTIONS_BLOCS = [
  'header',
  'paragraph',
  'paragraphwithlink',
  '2images',
  'headerparagraph',
  'headerlist',
  'headerimage',
  'headerparaimage',
  'headerpara2images',
  'complex',
];

describe('Test getMetadata', () => {
  SECTIONS_BLOCS.forEach((block) => {
    it(`indvidual section block: ${block}`, () => {
      assertMatchDir('sections', block, callback);
    });
  });

  it('getmetadata does not fail with "empty" mdast', () => {
    const dat = {
      content: {
        mdast: {},
      },
    };
    getmetadata(dat, { logger });
    assert.deepEqual(dat.content.meta, { types: [] });
  });

  it('getmetadata does not fail with empty sections', () => {
    const dat = {
      content: {
        mdast: {
          children: [],
          position: {},
          type: '',
        },
      },
    };
    getmetadata(dat, { logger });
    assert.deepEqual(dat.content, {
      meta: {
        types: [],
      },
      title: '',
      intro: '',
      image: undefined,
      mdast: {
        children: [],
        position: {},
        meta: {
          types: [],
        },
        type: '',
        title: '',
        intro: '',
      },
    });
  });
});
