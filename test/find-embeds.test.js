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
import { logging } from '@adobe/helix-testutils';
import assert from 'assert';
import { u } from 'unist-builder';
import { inspect } from 'unist-util-inspect';
import { assertMatch, assertValid } from './markdown-utils.js';
import coerce from '../src/html/coerce-secrets.js';

import parse from '../src/html/parse-markdown.js';
import {
  // eslint-disable-next-line import/no-named-default
  default as embeds, internalImgEmbed, internalIaEmbed, internalGatsbyEmbed,
} from '../src/html/find-embeds.js';

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

const action = {
  logger,
  request: {
    params: {
      path: '/index.md',
    },
  },
};

function mdast(body) {
  const dat = { content: { body }, request: { extension: 'html', url: '/docs/index.html' } };
  parse(dat, { logger });
  embeds(dat, action);
  return dat.content.mdast;
}

function context(body) {
  const dat = { content: { body }, request: { extension: 'html', url: '/docs/index.html' } };
  parse(dat, { logger });
  embeds(dat, action);
  return dat;
}

describe('Test Embed Detection Processing', () => {
  before('Coerce defaults', async () => {
    await coerce(action);
  });

  it('Parses markdown with embeds', () => {
    assertMatch('embeds', mdast);
  });

  it('Parses markdown with embeds from word2md', () => {
    assertMatch('wordembeds', mdast);
  });

  it('Parses markdown with embeds from gdocs2md', () => {
    assertMatch('googleembeds', mdast);
  });
});

describe('Validate Embed Examples In Pipeline', () => {
  before('Coerce defaults', async () => {
    await coerce(action);
  });

  it('Markdown with embeds yields valid context', (done) => {
    assertValid('embeds', context, done);
  });
});

describe('Find Embeds #unit', () => {
  const base = '/docs/index.html';

  it('internalGatsbyEmbed', () => {
    ['foo: foo.md',
      'embed:',
      'embed: ?foo=bar',
      'embed: foo.txt',
    ]
      .forEach((t) => assert.ok(!internalGatsbyEmbed(t, base, 'html', 'md'), `${t} should be invalid`));

    ['embed: foo.md',
      'html: foo.md',
      'markdown: foo.md',
      'embed:markdown.md',
      'embed: foo.html',
      'embed: ../foo.html',
      'embed: /foo.html',
      'embed: ../docs/rocks/../foo.html']
      .forEach((t) => assert.ok(internalGatsbyEmbed(t, base, 'html', 'md'), `${t} should be valid`));
  });

  it('internalIaEmbed', () => {
    [
      u('paragraph', [
        u('text', {}, 'I\'m just a text. Don\'t mind me.'),
      ]),
      u('paragraph', [
        u('text', {}, '/foo.md'),
        u('text', {}, '/foo.md'),
      ]),
      u('paragraph', [
        u('text', {}, '/foo.txt'),
      ]),
      u('paragraph', [
        u('text', {}, ' foo.md'),
      ]),
    ].forEach((t) => assert.ok(!internalIaEmbed(t, base, 'html', 'md'), `Expected invalid:\n${inspect(t)}`));
    [
      u('paragraph', [
        u('text', {}, '/foo.md'),
      ]),
      u('paragraph', [
        u('text', {}, '/foo.html'),
      ]),
      u('paragraph', [
        u('text', {}, '../foo.md'),
      ]),
      u('paragraph', [
        u('text', {}, '/readme/foo.md'),
      ]),
      u('paragraph', [
        u('text', {}, '../help/foo.md'),
      ]),
    ].forEach((t) => assert.ok(internalIaEmbed(t, base, 'html', 'md'), `Expected valid:\n${inspect(t)}`));
  });

  it('internalImgEmbed', () => {
    [
      u('paragraph', [
        u('image', { url: 'test.png' }),
      ]),
    ].forEach((t) => assert.ok(!internalImgEmbed(t, base, 'html', 'md'), `Expected invalid:\n${inspect(t)}`));
    [
      u('paragraph', [
        u('image', { url: 'test.md' }),
      ]),
      u('paragraph', [
        u('image', { url: '../test.md' }),
      ]),
      u('paragraph', [
        u('image', { url: '../readme/test.html' }),
      ]),
    ].forEach((t) => assert.ok(internalImgEmbed(t, base, 'html', 'md'), `Expected valid:\n${inspect(t)}`));
  });
});
