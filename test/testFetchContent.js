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
const { VersionLock } = require('@adobe/openwhisk-action-utils');
const nock = require('nock');
const { pipe } = require('../src/defaults/html.pipe.js');
const coerce = require('../src/utils/coerce-secrets');
const Downloader = require('../src/utils/Downloader.js');

describe('Testing fetch content', () => {
  let action;
  let context;
  let logger;

  afterEach(() => {
    nock.restore();
    delete process.env.__OW_NAMESPACE;
  });

  beforeEach(() => {
    logger = logging.createTestLogger({
      // tune this for debugging
      level: 'info',
    });
    context = {
      request: {
        path: '/adobe/test-repo/master/hello.md',
      },
    };
    action = coerce({
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
      versionLock: new VersionLock(),
    });
    nock.restore();
    nock.activate();
    nock.cleanAll();
    delete process.env.__OW_NAMESPACE;
  });

  it('passes non-standard raw github to content proxy', async () => {
    nock('https://frozen.githubusercontent.com')
      .get('/adobe/test-repo/master/helix-markup.yaml')
      .reply(() => [404, 'Not Found']);
    nock('https://adobeioruntime.net')
      .get('/api/v1/web/helix/helix-services/content-proxy@v1?owner=adobe&repo=test-repo&path=%2Fhello.md&ref=master&REPO_RAW_ROOT=https%3A%2F%2Ffrozen.githubusercontent.com/')
      .reply(() => [200, '# Hello\nfrom github.\n\n---\n\n# Bar']);

    action.downloader = new Downloader(context, action, { forceHttp1: true });
    action.secrets.REPO_RAW_ROOT = 'https://frozen.githubusercontent.com/';

    const result = await pipe((ctx) => {
      const { content } = ctx;
      ctx.response = { status: 200, body: content.document.body.innerHTML };
    }, context, action);

    assert.equal(result.response.body, '<div>\n<h1 id="hello">Hello</h1>\n<p>from github.</p>\n</div>\n<div>\n<h1 id="bar">Bar</h1>\n</div>');
  });

  it('uses custom content proxy url', async () => {
    process.env.__OW_NAMESPACE = 'my-namespace';
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/helix-markup.yaml')
      .reply(() => [404, 'Not Found']);
    nock('https://adobeioruntime.net')
      .get('/foo/bar?owner=adobe&repo=test-repo&path=%2Fhello.md&ref=master')
      .reply(() => [200, '# Hello\nfrom github.\n\n---\n\n# Bar']);

    action.downloader = new Downloader(context, action, { forceHttp1: true });
    action.secrets.CONTENT_PROXY_URL = 'https://adobeioruntime.net/foo/bar';

    const result = await pipe((ctx) => {
      const { content } = ctx;
      ctx.response = { status: 200, body: content.document.body.innerHTML };
    }, context, action);

    assert.equal(result.response.body, '<div>\n<h1 id="hello">Hello</h1>\n<p>from github.</p>\n</div>\n<div>\n<h1 id="bar">Bar</h1>\n</div>');
  });

  it('uses version lock for  content proxy url', async () => {
    process.env.__OW_NAMESPACE = 'my-namespace';
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/helix-markup.yaml')
      .reply(() => [404, 'Not Found']);
    nock('https://adobeioruntime.net')
      .get('/api/v1/web/my-namespace/helix-services/content-proxy@v1.2.3')
      .query(true)
      .reply(() => [200, '# Hello\nfrom github.\n\n---\n\n# Bar']);

    action.downloader = new Downloader(context, action, { forceHttp1: true });
    action.versionLock = new VersionLock({
      __ow_headers: {
        'x-ow-version-lock': 'content-proxy=content-proxy@v1.2.3',
      },
    });

    const result = await pipe((ctx) => {
      const { content } = ctx;
      ctx.response = { status: 200, body: content.document.body.innerHTML };
    }, context, action);

    assert.equal(result.response.body, '<div>\n<h1 id="hello">Hello</h1>\n<p>from github.</p>\n</div>\n<div>\n<h1 id="bar">Bar</h1>\n</div>');
  });

  it('uses namespace from environment', async () => {
    process.env.__OW_NAMESPACE = 'my-namespace';
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/helix-markup.yaml')
      .reply(() => [404, 'Not Found']);
    nock('https://adobeioruntime.net')
      .get('/api/v1/web/my-namespace/helix-services/content-proxy@v1?owner=adobe&repo=test-repo&path=%2Fhello.md&ref=master')
      .reply(() => [200, '# Hello\nfrom github.\n\n---\n\n# Bar']);

    action.downloader = new Downloader(context, action, { forceHttp1: true });

    const result = await pipe((ctx) => {
      const { content } = ctx;
      ctx.response = { status: 200, body: content.document.body.innerHTML };
    }, context, action);

    assert.equal(result.response.body, '<div>\n<h1 id="hello">Hello</h1>\n<p>from github.</p>\n</div>\n<div>\n<h1 id="bar">Bar</h1>\n</div>');
  });

  it('passes github token to content proxy', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/helix-markup.yaml')
      .reply(() => [404, 'Not Found']);
    nock('https://adobeioruntime.net')
      .get('/api/v1/web/helix/helix-services/content-proxy@v1?owner=adobe&repo=test-repo&path=%2Fhello.md&ref=master')
      .reply(function cb() {
        try {
          assert.equal(this.req.headers['x-github-token'], 'dummy-token');
          return [200, '# Hello\nfrom github.\n\n---\n\n# Bar', {}];
        } catch (e) {
          return [200, `# error\n\n${e}`, {}];
        }
      });

    action.downloader = new Downloader(context, action, { forceHttp1: true });
    action.secrets.GITHUB_TOKEN = 'dummy-token';

    const result = await pipe((ctx) => {
      const { content } = ctx;
      ctx.response = { status: 200, body: content.document.body.innerHTML };
    }, context, action);

    assert.equal(result.response.body, '<div>\n<h1 id="hello">Hello</h1>\n<p>from github.</p>\n</div>\n<div>\n<h1 id="bar">Bar</h1>\n</div>');
  });

  it('sets source hash and location', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/helix-markup.yaml')
      .reply(() => [404, 'Not Found']);
    nock('https://adobeioruntime.net')
      .get('/api/v1/web/helix/helix-services/content-proxy@v1?owner=adobe&repo=test-repo&path=%2Fhello.md&ref=master')
      .reply(200, '# Hello\nfrom github.\n\n---\n\n# Bar', {
        'x-source-location': 'https://onedrive.com/hello.docx',
      });

    action.downloader = new Downloader(context, action, { forceHttp1: true });

    const result = await pipe((ctx) => {
      const { content } = ctx;
      ctx.response = { status: 200, body: JSON.stringify(content.data) };
    }, context, action);

    assert.equal(result.response.body, '{"sourceLocation":"https://onedrive.com/hello.docx","sourceHash":"WCoswd7nuFy/cY2v"}');
  });

  it('supports non-url source location ', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/helix-markup.yaml')
      .reply(() => [404, 'Not Found']);
    nock('https://adobeioruntime.net')
      .get('/api/v1/web/helix/helix-services/content-proxy@v1?owner=adobe&repo=test-repo&path=%2Fhello.md&ref=master')
      .reply(200, '# Hello\nfrom github.\n\n---\n\n# Bar', {
        'x-source-location': '/drives/b!PpnkewKFAEaDTS6slvlVjh_3ih9lhEZMgYWwps6bPIWZMmLU5xGqS4uES8kIQZbH/items/01DJQLOW44UHM362CKX5GYMQO2F4JIHSEV',
      });

    action.downloader = new Downloader(context, action, { forceHttp1: true });

    const result = await pipe((ctx) => {
      const { content } = ctx;
      ctx.response = { status: 200, body: JSON.stringify(content.data) };
    }, context, action);

    assert.equal(result.response.body, '{"sourceLocation":"/drives/b!PpnkewKFAEaDTS6slvlVjh_3ih9lhEZMgYWwps6bPIWZMmLU5xGqS4uES8kIQZbH/items/01DJQLOW44UHM362CKX5GYMQO2F4JIHSEV","sourceHash":"g3TgmFV5eZurYJ+M"}');
  });
});
