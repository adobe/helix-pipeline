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

const TEST_FSTAB = `
mountpoints:
  /ms: https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog
  /g: https://drive.google.com/drive/u/0/folders/1y0EEk2QxbkM4A5InGqwHheGJ6LNCSKvn
  /experimental: http://localhost:4502
`;

const TEST_ROOT_FSTAB = `
mountpoints:
  /: https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog
`;

describe('Testing HTML Pipeline with fstab', () => {
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

  it('html.pipe renders github content if not match for mountpoint', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/fstab.yaml')
      .reply(() => [200, TEST_FSTAB])
      .get('/adobe/test-repo/master/docs/hello.md')
      .reply(() => [200, 'hello in github.\n']);


    const context = {};
    const action = coerce({
      request: {
        headers: {
          'Cache-Control': 'no-store',
          'x-request-id': '1234',
        },
        params: {
          path: '/docs/hello.md',
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
    console.log(logger.getOutput());
    assert.equal(result.error, undefined);
    assert.equal(result.response.body, '<p>hello in github.</p>');
    assert.notEqual(result.response.status, 500);
  });

  it('html.pipe renders github content if not match for unknown type', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/fstab.yaml')
      .reply(() => [200, TEST_FSTAB])
      .get('/adobe/test-repo/master/experimental/hello.md')
      .reply(() => [200, 'hello in github.\n']);


    const context = {};
    const action = coerce({
      request: {
        headers: {
          'Cache-Control': 'no-store',
          'x-request-id': '1234',
        },
        params: {
          path: '/experimental/hello.md',
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
    console.log(logger.getOutput());
    assert.ok(logger.getOutput().indexOf('info: mount point type not detected for \'http://localhost:4502\'.') >= 0);
    assert.equal(result.error, undefined);
    assert.equal(result.response.body, '<p>hello in github.</p>');
    assert.notEqual(result.response.status, 500);
  });

  it('html.pipe renders onedrive document correctly', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/fstab.yaml')
      .reply(() => [200, TEST_FSTAB]);

    nock('https://adobeioruntime.net')
      .get('/api/v1/web/helix/helix-services/word2md@v1')
      .query((q) => {
        assert.equal(q.path, '/en/posts/hello.docx');
        assert.equal(q.shareLink, 'https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog');
        assert.equal(q.rid, '1234');
        assert.equal(q.src, 'adobe/test-repo/master');
        return true;
      })
      .reply(() => [200, 'hello from onedrive.\n', {
        'x-source-location': '/drives/1234/items/5678',
      }]);

    const context = {};
    const action = coerce({
      request: {
        headers: {
          'Cache-Control': 'no-store',
          'x-request-id': '1234',
        },
        params: {
          path: '/ms/en/posts/hello.selector.md',
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
    console.log(logger.getOutput());
    assert.equal(result.error, undefined);
    assert.equal(result.response.body, '<p>hello from onedrive.</p>');
    assert.notEqual(result.response.status, 500);
    assert.equal(context.content.data.sourceLocation, '/drives/1234/items/5678');
    assert.equal(context.content.data.sourceHash, 'MTpvnZdh6fTIk6Sb');
  });

  it('html.pipe with fstab renders fallback markdown correctly if not found in onedrive', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/fstab.yaml')
      .reply(() => [200, TEST_ROOT_FSTAB])
      .get('/adobe/test-repo/master/header.md')
      .reply(() => [200, 'hello in github.\n']);

    nock('https://adobeioruntime.net')
      .get('/api/v1/web/helix/helix-services/word2md@v1')
      .query(() => (true))
      .reply(404);

    const context = {};
    const action = coerce({
      request: {
        headers: {
          'Cache-Control': 'no-store',
          'x-request-id': '1234',
        },
        params: {
          path: '/header.md',
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
    console.log(logger.getOutput());

    assert.equal(result.error, undefined);
    assert.equal(result.response.body, '<p>hello in github.</p>');
    assert.notEqual(result.response.status, 500);
  });

  it('html.pipe renders google docs document correctly', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/fstab.yaml')
      .reply(() => [200, TEST_FSTAB]);

    nock('https://adobeioruntime.net')
      .get('/api/v1/web/helix/helix-services/gdocs2md@v1')
      .query((q) => {
        assert.equal(q.path, '/mydoc');
        assert.equal(q.rootId, '1y0EEk2QxbkM4A5InGqwHheGJ6LNCSKvn');
        assert.equal(q.rid, '1234');
        assert.equal(q.src, 'adobe/test-repo/master');
        return true;
      })
      .reply(() => [200, 'hello from onedrive.\n', {
        'x-source-location': '/drives/1234/items/5678',
      }]);

    const context = {};
    const action = coerce({
      request: {
        headers: {
          'Cache-Control': 'no-store',
          'x-request-id': '1234',
        },
        params: {
          path: '/g/mydoc.md',
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
    console.log(logger.getOutput());
    assert.equal(result.error, undefined);
    assert.equal(result.response.body, '<p>hello from onedrive.</p>');
    assert.notEqual(result.response.status, 500);
    assert.equal(context.content.data.sourceLocation, '/drives/1234/items/5678');
    assert.equal(context.content.data.sourceHash, 'MTpvnZdh6fTIk6Sb');
  });
});
