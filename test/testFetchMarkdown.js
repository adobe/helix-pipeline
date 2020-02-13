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
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');
const { setupMocha: setupPolly } = require('@pollyjs/core');
const fetch = require('../src/html/fetch-markdown');
const coerce = require('../src/utils/coerce-secrets');

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

describe('Test URI parsing and construction', () => {
  it('fetch.uri is a function', () => {
    assert.equal(typeof fetch.uri, 'function');
  });

  it('fetch.uri constructs URIs', () => {
    assert.equal(
      fetch.uri(
        'https://raw.githubusercontent.com',
        'adobe',
        'xdm',
        'master',
        'README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/master/README.md',
    );
  });

  it('fetch.uri deals with trailing slashes', () => {
    assert.equal(
      fetch.uri(
        'https://raw.githubusercontent.com/',
        'adobe',
        'xdm',
        'master',
        'README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/master/README.md',
    );
  });

  it('fetch.uri deals with leading slashes', () => {
    assert.equal(
      fetch.uri(
        'https://raw.githubusercontent.com',
        'adobe',
        'xdm',
        'master',
        '/README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/master/README.md',
    );
  });

  it('fetch.uri deals with slashes in refs', () => {
    assert.equal(
      fetch.uri(
        'https://raw.githubusercontent.com',
        'adobe',
        'xdm',
        'tags/release_1',
        '/README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/tags/release_1/README.md',
    );
  });

  it('fetch.uri deals with ugly slashes in refs', () => {
    assert.equal(
      fetch.uri(
        'https://raw.githubusercontent.com',
        'adobe',
        'xdm',
        '/tags/release_1/',
        '/README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/tags/release_1/README.md',
    );
  });

  it('fetch.uri deals with ugly slashes in owner', () => {
    assert.equal(
      fetch.uri(
        'https://raw.githubusercontent.com',
        '/adobe/',
        'xdm',
        'tags/release_1',
        '/README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/tags/release_1/README.md',
    );
  });

  it('fetch.uri deals with ugly slashes in repo', () => {
    assert.equal(
      fetch.uri(
        'https://raw.githubusercontent.com',
        'adobe',
        '/xdm/',
        'tags/release_1',
        '/README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/tags/release_1/README.md',
    );
  });
});

describe('Test invalid input', () => {
  it('Test for missing owner', async () => {
    await assert.rejects(() => (fetch(
      {},
      {
        request: { params: { repo: 'xdm', ref: 'master', path: 'README.md' } },
        logger,
      },
    )), {
      name: 'Error',
      message: 'Unknown owner, cannot fetch content',
    });
  });

  it('Test for missing repo', async () => {
    await assert.rejects(() => (fetch(
      {},
      {
        request: { params: { ref: 'master', path: 'README.md', owner: 'adobe' } },
        logger,
      },
    )), {
      name: 'Error',
      message: 'Unknown repo, cannot fetch content',
    });
  });

  it('Test for missing path', async () => {
    await assert.rejects(() => (fetch(
      {},
      {
        request: { params: { repo: 'xdm', ref: 'master', owner: 'adobe' } },
        logger,
      },
    )), {
      name: 'Error',
      message: 'Unknown path, cannot fetch content',
    });
  });

  it('Test for missing params', async () => {
    await assert.rejects(() => (fetch(
      {},
      {
        request: {},
        logger,
      },
    )));
  }, {
    name: 'Error',
    message: 'Unknown path, cannot fetch content',
  });

  it('Test for missing request', async () => {
    await assert.rejects(() => (fetch(
      {},
      { logger },
    )), {
      name: 'Error',
      message: 'Request parameters missing',
    });
  });
});

describe('Test non-existing content', () => {
  setupPolly({
    logging: false,
    recordFailedRequests: true,
    adapters: [NodeHttpAdapter],
    persister: FSPersister,
    persisterOptions: {
      fs: {
        recordingsDir: 'test/fixtures',
      },
    },
  });

  it('Getting XDM README (from wrong URL)', async () => {
    const myaction = {
      request: {
        params: {
          repo: 'xdm', ref: 'master', path: 'README.md', owner: 'nobody',
        },
        headers: {},
      },
      logger,
    };

    await coerce(myaction);
    const context = {};
    await fetch(context, myaction);
    assert.ok(context.error);
  });

  it('Getting XDM README (with missing ref)', async () => {
    const myaction = {
      request: {
        params: {
          repo: 'xdm', ref: '', path: 'README.md', owner: 'adobe',
        },
        headers: {},
      },
      logger,
    };

    await coerce(myaction);
    const context = {};
    await fetch(context, myaction);
    assert.ok(context.content.body);
  });
});

describe('Test requests', () => {
  setupPolly({
    logging: false,
    recordFailedRequests: false,
    recordIfMissing: false,
    matchRequestsBy: {
      headers: {
        exclude: ['authorization', 'accept-encoding'],
      },
    },
    adapters: [NodeHttpAdapter],
    persister: FSPersister,
    persisterOptions: {
      fs: {
        recordingsDir: 'test/fixtures',
      },
    },
  });

  it('Getting XDM README', async function testGet() {
    const myaction = {
      request: {
        params: {
          repo: 'xdm', ref: 'master', path: 'README.md', owner: 'adobe',
        },
        headers: {
          'Cache-Control': 'no-store',
        },
      },
      logger,
    };

    const { server } = this.polly;
    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/README.md')
      .intercept((req, res) => {
        assert.equal(req.headers.connection, 'keep-alive');
        assert.equal(req.headers['user-agent'], 'helix-fetch');
        assert.equal(req.headers.host, 'raw.githubusercontent.com');
        res.body = '# Foo Data Model (XDM) Schema';
      });

    await coerce(myaction);
    const context = {};
    await fetch(context, myaction);
    assert.ok(!context.error);
    assert.ok(context.content.body);
    assert.equal(context.content.body.split('\n')[0], '# Foo Data Model (XDM) Schema');
  });

  it('Getting README from private repo with GitHub token', async function testToken() {
    const myaction = {
      request: {
        params: {
          repo: 'project-helix', ref: 'master', path: 'README.md', owner: 'adobe',
        },
        headers: {
          'Cache-Control': 'no-store',
        },
      },
      logger,
      secrets: {},
    };

    const token = 'undisclosed-token';
    let authHeader = '';
    const { server } = this.polly;
    server
      .get('https://raw.githubusercontent.com/adobe/project-helix/master/README.md')
      .on('request', (req) => {
        authHeader = req.headers.Authorization;
      });

    await coerce(myaction);
    const context = {};

    // test with GitHub token from action.secrets
    myaction.secrets.GITHUB_TOKEN = token;
    await fetch(context, myaction);
    assert.equal(authHeader, `token ${token}`, 'GitHub token from action.secrets.GITHUB_TOKEN used');
    myaction.secrets.GITHUB_TOKEN = '';
    authHeader = '';

    // test with GitHub token from request headers
    myaction.request.headers['x-github-token'] = token;
    await fetch(context, myaction);
    assert.equal(authHeader, `token ${token}`, 'GitHub token from request headers["x-github-token"] used');
  });
});


describe('Test misbehaved HTTP Responses', () => {
  setupPolly({
    logging: false,
    recordFailedRequests: false,
    recordIfMissing: false,
    adapters: [NodeHttpAdapter],
    persister: FSPersister,
    persisterOptions: {
      fs: {
        recordingsDir: 'test/fixtures',
      },
    },
  });

  it('Getting XDM README with bad HTTP Status Code', async function badStatus() {
    const { server } = this.polly;

    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/README.md')
      .intercept((_, res) => res.sendStatus(500));

    const myaction = {
      request: {
        params: {
          repo: 'xdm', ref: 'master', path: 'README.md', owner: 'adobe',
        },
        headers: {
          'Cache-Control': 'no-store',
        },
      },
      logger,
    };

    await coerce(myaction);
    const context = {};
    await fetch(context, myaction);
    assert.ok(context.error);
    assert.equal(context.response.status, 502);
  });

  it('Getting XDM README with ultra-short Timeout', async function shortTimeout() {
    const { server } = this.polly;

    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/README.md')
      .intercept(async (_, res, interceptor) => {
        await server.timeout(50);
        interceptor.abort();
      });

    const myaction = {
      request: {
        params: {
          repo: 'xdm', ref: 'master', path: 'README.md', owner: 'adobe',
        },
        headers: {
          'Cache-Control': 'no-store',
        },
      },
      logger,
      secrets: {
        HTTP_TIMEOUT: 10,
      },
    };

    await coerce(myaction);
    const context = {};
    await fetch(context, myaction);
    assert.ok(context.error);
    assert.equal(context.response.status, 504);
  });

  it('Getting XDM README with Backend Timeout', async function badTimeout() {
    const { server } = this.polly;
    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/README.md')
      .intercept(async (_, res, interceptor) => {
        await server.timeout(2000);
        interceptor.abort();
      });

    const myaction = {
      request: {
        params: {
          repo: 'xdm', ref: 'master', path: 'README.md', owner: 'adobe',
        },
        headers: {
          'Cache-Control': 'no-store',
        },
      },
      logger,
    };

    await coerce(myaction);
    const context = {};
    await fetch(context, myaction);
    assert.ok(context.error);
    assert.equal(context.response.status, 504);
  }).timeout(3000);
});
