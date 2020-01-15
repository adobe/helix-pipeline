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
const { logging } = require('@adobe/helix-testutils');
const parse = require('../src/html/parse-markdown');
const split = require('../src/html/split-sections');
const parseFront = require('../src/html/parse-frontmatter');
const { assertMatchDir } = require('./markdown-utils');
const getmetadata = require('../src/html/get-metadata');

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

function callback(body) {
  const dat = { content: { body } };
  parse(dat, { logger });
  parseFront(dat, { logger });
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
  'herosection',
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

  it('getmetadata gets first title and intro', () => {
    const dat = { content: {} };
    dat.content.mdast = {
      type: 'root',
      children: [
        {
          type: 'section',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'image',
                  title: null,
                  url: './helix_logo.png',
                  alt: 'helix-logo',
                },
              ],
              meta: {
                types: [
                  'has-image',
                ],
              },
            },
          ],
          meta: {
            types: [
              'has-image',
              'nb-image-1',
              'has-only-image',
            ],
          },
          title: '',
          intro: '',
          image: './helix_logo.png',
        },
        {
          type: 'section',
          children: [
            {
              type: 'heading',
              depth: 1,
              children: [
                {
                  type: 'text',
                  value: 'Header and one image',
                },
              ],
              meta: {
                types: [
                  'is-heading',
                ],
              },
            },
          ],
          meta: {
            types: [
              'has-heading',
              'nb-heading-1',
              'has-only-heading',
            ],
          },
          title: 'Header and one image',
          intro: 'Header and one image',
        },
      ],
    };
    getmetadata(dat, { logger });
    assert.equal(dat.content.title, 'Header and one image');
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
