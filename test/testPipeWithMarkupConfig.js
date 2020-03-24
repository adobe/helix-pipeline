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
const { logging } = require('@adobe/helix-testutils');
const nock = require('nock');
const { pipe } = require('../src/defaults/html.pipe.js');
const coerce = require('../src/utils/coerce-secrets');
const Downloader = require('../src/utils/Downloader.js');

const TEST_MARKUP_CONFIG_MD = `
version: 1
markup:
  foo:
    match: paragraph
    classnames: bar
    attribute:
      baz: qux
    wrap: .corge
    type: markdown
`;
const TEST_MARKUP_CONFIG_HTML = `
version: 1
markup:
  foo:
    match: p
    classnames: bar
    attribute:
      baz: qux
    wrap: .corge
    type: html
`;

describe('Testing HTML Pipeline with markup config', () => {
  let logger;

  afterEach(() => {
    nock.restore();
  });

  beforeEach(() => {
    logger = logging.createTestLogger({
      // tune this for debugging
      level: 'info',
    });
    nock.restore();
    nock.activate();
    nock.cleanAll();
  });

  it('html.pipe adjusts the MDAST as per markup config', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/helix-markup.yaml')
      .reply(() => [200, TEST_MARKUP_CONFIG_MD])
      .get('/adobe/test-repo/master/hello.md')
      .reply(() => [200, '# Hello\nfrom github.\n']);

    const context = {};
    const action = coerce({
      request: {
        headers: {
          'Cache-Control': 'no-store',
          'x-request-id': '1234',
        },
        params: {
          path: '/hello.md',
          owner: 'adobe',
          repo: 'test-repo',
          ref: 'master',
        },
      },
      secrets: {},
      logger,
    });
    action.downloader = new Downloader(context, action, { forceHttp1: true });

    const result = await pipe((ctx) => {
      const { content } = ctx;
      ctx.response = { status: 200, body: content.document.body.innerHTML };
    },
    context,
    action);

    // eslint-disable-next-line no-console
    assert.equal(result.error, undefined);
    assert.equal(result.response.body, '<h1 id="hello">Hello</h1>\n<div class="corge"><p class="bar" baz="qux">from github.</p></div>');
    assert.notEqual(result.response.status, 500);
  });

  it('html.pipe adjusts the DOM as per markup config', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/helix-markup.yaml')
      .reply(() => [200, TEST_MARKUP_CONFIG_HTML])
      .get('/adobe/test-repo/master/hello.md')
      .reply(() => [200, '# Hello\nfrom github.\n']);


    const context = {};
    const action = coerce({
      request: {
        headers: {
          'Cache-Control': 'no-store',
          'x-request-id': '1234',
        },
        params: {
          path: '/hello.md',
          owner: 'adobe',
          repo: 'test-repo',
          ref: 'master',
        },
      },
      secrets: {},
      logger,
    });
    action.downloader = new Downloader(context, action, { forceHttp1: true });

    const result = await pipe((ctx) => {
      const { content } = ctx;
      ctx.response = { status: 200, body: content.document.body.innerHTML };
    },
    context,
    action);

    // eslint-disable-next-line no-console
    assert.equal(result.error, undefined);
    assert.equal(result.response.body, '<h1 id="hello">Hello</h1>\n<div class="corge"><p class="bar" baz="qux">from github.</p></div>');
    assert.notEqual(result.response.status, 500);
  });
});
