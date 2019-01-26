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
const { assertMatchDir } = require('./markdown-utils');
const getmetadata = require('../src/html/get-metadata');

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

function callback(body) {
  const parsed = split(parse({ content: { body } }, { logger }), { logger });
  return getmetadata(parsed, { logger }).content.sections;
}

const SECTIONS_BLOCS = [
  'header',
  'paragraph',
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
    assert.deepEqual(
      getmetadata({
        content: {
          sections: [],
          mdast: {
            children: [],
            position: {},
            type: '',
          },
        },
      }, { logger }),
      {
        content: { meta: {} },
      },
    );
  });

  it('getmetadata does not fail with missing sections', () => {
    assert.deepEqual(
      getmetadata({
        content: {
          mdast: {
            children: [],
            position: {},
            type: '',
          },
        },
      }, { logger }),
      {
        content: { meta: {} },
      },
    );
  });

  it('getmetadata does not fail with empty sections', () => {
    assert.deepEqual(
      getmetadata({
        content: {
          sections: [{}],
          mdast: {
            children: [],
            position: {},
            type: '',
          },
        },
      }, { logger }),

      {
        content:
          {
            sections: [{ meta: {}, types: [] }],
            meta: {},
            title: undefined,
            intro: undefined,
            image: undefined,
          },
      },
    );
  });
});
