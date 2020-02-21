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
const fetch = require('../src/html/fetch-markdown');
const coerce = require('../src/utils/coerce-secrets');
const Downloader = require('../src/utils/Downloader.js');
const { setupPolly } = require('./utils.js');

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

function doFetch(context, action) {
  const mgr = new Downloader(context, action, {
    forceNoCache: true,
    forceHttp1: true,
  });
  action.downloader = mgr;
  return fetch(context, action).finally(mgr.destroy.bind(mgr));
}

describe('Test invalid input', () => {
  it('Test for missing owner', async () => {
    await assert.rejects(() => (doFetch(
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
    await assert.rejects(() => (doFetch(
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
    await assert.rejects(() => (doFetch(
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
    await assert.rejects(() => (doFetch(
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
    await assert.rejects(() => (doFetch(
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
    recordIfMissing: false,
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
    await doFetch(context, myaction);
    assert.ok(context.error);
  });

  it('Getting XDM README (with missing ref)', async function missingRef() {
    const { server } = this.polly;

    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/helix-markup.yaml')
      .intercept((_, res) => res.sendStatus(404));

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
    await doFetch(context, myaction);
    assert.ok(context.content.body);
  });

  it('Getting helix-markup.yaml when it does not exist', async function badStatus() {
    const { server } = this.polly;

    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/helix-markup.yaml')
      .intercept((_, res) => res.sendStatus(404));

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
    assert.equal(!context.error, true);
    assert.equal(!myaction.markupconfig, true);
  });
});

describe('Test requests', () => {
  setupPolly({
    recordIfMissing: false,
  });

  it('Getting XDM README', async function testPublic() {
    const { server } = this.polly;

    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/helix-markup.yaml')
      .intercept((_, res) => res.sendStatus(404));

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
    await doFetch(context, myaction);
    assert.ok(context.content.body);
    assert.equal(context.content.body.split('\n')[0], '# Experience Data Model (XDM) Schema');
  });

  it('Getting README from private repo with GitHub token', async function testToken() {
    const { server } = this.polly;

    const token = 'undisclosed-token';
    let authHeader = '';
    server
      .get('https://raw.githubusercontent.com/adobe/project-helix/master/README.md')
      .on('request', (req) => {
        authHeader = req.headers.Authorization;
      });
    server
      .get('https://raw.githubusercontent.com/adobe/project-helix/master/helix-markup.yaml')
      .on('request', (req) => {
        authHeader = req.headers.Authorization;
      })
      .intercept((_, res) => res.sendStatus(404));

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

    await coerce(myaction);
    const context = {};

    // test with GitHub token from action.secrets
    myaction.secrets.GITHUB_TOKEN = token;
    await doFetch(context, myaction);
    assert.equal(authHeader, `token ${token}`, 'GitHub token from action.secrets.GITHUB_TOKEN used');
    myaction.secrets.GITHUB_TOKEN = '';
    authHeader = '';

    // test with GitHub token from request headers
    myaction.request.headers['x-github-token'] = token;
    await doFetch(context, myaction);
    assert.equal(authHeader, `token ${token}`, 'GitHub token from request headers["x-github-token"] used');
  });

  it('Getting helix-markup.xml README', async () => {
    const myaction = {
      request: {
        params: {
          repo: 'hlx-test-markupconfig', ref: 'master', path: 'index.md', owner: 'ramboz',
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
    assert.ok(myaction.markupconfig);
    assert.equal(myaction.markupconfig.markup.foo.wrap, '.qux');
    assert.equal(myaction.markupconfig.markup.corge.wrap, '.waldo');
  });
});


describe('Test misbehaved HTTP Responses', () => {
  setupPolly({
    recordFailedRequests: false,
    recordIfMissing: false,
  });

  beforeEach(async function setup() {
    const { server } = this.polly;
    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/helix-markup.yaml')
      .intercept((_, res) => res.sendStatus(404));
  });

  it('Getting XDM README with bad HTTP Status Code', async function badStatus() {
    const { server } = this.polly;

    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/README.md')
      .intercept((_, res) => res.sendStatus(500));
    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/helix-markup.yaml')
      .intercept((_, res) => res.sendStatus(404));

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
    await doFetch(context, myaction);
    assert.ok(context.error);
    assert.equal(context.response.status, 502);
  });

  it('Getting XDM README with ultra-short Timeout', async function shortTimeout() {
    const { server } = this.polly;

    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/README.md')
      .intercept(async (_, res) => {
        await server.timeout(50);
        res.sendStatus(500);
      });
    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/helix-markup.yaml')
      .intercept((_, res) => res.sendStatus(404));

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
    await doFetch(context, myaction);
    assert.ok(context.error);
    assert.equal(context.response.status, 504);
  });

  it('Getting XDM README with Backend Timeout', async function badTimeout() {
    const { server } = this.polly;
    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/README.md')
      .intercept(async (_, res) => {
        await server.timeout(1500);
        res.sendStatus(500);
      });
    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/helix-markup.yaml')
      .intercept((_, res) => res.sendStatus(404));

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
    await doFetch(context, myaction);
    assert.ok(context.error);
    assert.equal(context.response.status, 504);
  }).timeout(3000);

  it('Getting helix-markup.yaml with bad HTTP Status Code', async function badStatus() {
    const { server } = this.polly;

    server
      .get('https://raw.githubusercontent.com/adobe/xdm/master/helix-markup.yaml')
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
    assert.equal(!context.error, true);
    assert.equal(!myaction.markupconfig, true);
  });
});
