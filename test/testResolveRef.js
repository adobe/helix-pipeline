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
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');
const setupPolly = require('@pollyjs/core').setupMocha;
const resolveRef = require('../src/utils/resolve-ref');

const RESOLVE_GITREF_SERVICE = 'https://adobeioruntime.net/api/v1/web/helix/helix-services/resolve-git-ref%40v1';
const SERVICE_ACTION = '/helix/helix-services/resolve-git-ref%40v1';

// set this to an actual wsk token during recording.
const WSK_TOKEN = 'dummy';

describe('Test resolve git ref', () => {
  setupPolly({
    logging: false,
    recordFailedRequests: true,
    recordIfMissing: false,
    adapters: [NodeHttpAdapter],
    persister: FSPersister,
    persisterOptions: {
      fs: {
        recordingsDir: 'test/fixtures',
      },
    },
  });
  beforeEach(async function beforeEach() {
    this.polly.server.any().on('beforeResponse', (req) => {
      // don't record the authorization header
      req.removeHeaders(['authorization']);
    });
    this.polly.configure({
      matchRequestsBy: {
        headers: {
          exclude: ['authorization'],
        },
      },
    });
  });

  it('Resolve throws if no request', async () => {
    try {
      await resolveRef({}, {});
      assert.fail('should fail.');
    } catch (e) {
      assert.equal(e.message, 'Request parameters missing');
    }
  });

  it('Resolve throws if no owner', async () => {
    try {
      await resolveRef({}, {
        secrets: {
          REPO_RAW_ROOT: 'https://raw.github.com/',
          RESOLVE_GITREF_SERVICE,
        },
        request: {
          params: {},
        },

      });
      assert.fail('should fail.');
    } catch (e) {
      assert.equal(e.message, 'Unknown owner, cannot resolve github ref');
    }
  });

  it('Resolve throws if no repo', async () => {
    try {
      await resolveRef({}, {
        secrets: {
          REPO_RAW_ROOT: 'https://raw.github.com/',
          RESOLVE_GITREF_SERVICE,
        },
        request: {
          params: {
            owner: 'adobe',
          },
        },

      });
      assert.fail('should fail.');
    } catch (e) {
      assert.equal(e.message, 'Unknown repo, cannot resolve github ref');
    }
  });

  it('Resolve ignores if no REPO_RAW_ROOT.', async () => {
    const logger = Logger.getTestLogger({
      level: 'debug',
    });
    await resolveRef({}, {
      secrets: {
        RESOLVE_GITREF_SERVICE,
      },
      logger,
      request: {
        params: {},
      },
    });
    const out = await logger.getOutput();
    assert.ok(out.indexOf('cannot resolve ref. No REPO_RAW_ROOT specified.') > 0);
  });

  it('Resolve ignores if non github REPO_RAW_ROOT.', async () => {
    const logger = Logger.getTestLogger({
      level: 'debug',
    });
    await resolveRef({}, {
      secrets: {
        REPO_RAW_ROOT: 'https://bitbucket.org/',
        RESOLVE_GITREF_SERVICE,
      },
      logger,
      request: {
        params: {},
      },
    });
    const out = await logger.getOutput();
    assert.ok(out.indexOf('unable to resolve ref to non-github repository: https://bitbucket.org/') > 0);
  });

  it('Resolve ignores if non github REPO_RAW_ROOT but ignores error for localhost.', async () => {
    const logger = Logger.getTestLogger({
      level: 'debug',
    });
    const action = {
      secrets: {
        REPO_RAW_ROOT: 'https://localhost:1234/',
        RESOLVE_GITREF_SERVICE,
      },
      logger,
      request: {
        params: {},
      },
    };
    await resolveRef({}, action);
    const out = await logger.getOutput();
    assert.ok(out.indexOf('unable to resolve ref to non-github repository: https://localhost:1234/') < 0);
    assert.equal(action.request.params.ref, undefined);
  });

  it('Resolve ignores if non github REPO_RAW_ROOT but ignores error for 127.0.0.1.', async () => {
    const logger = Logger.getTestLogger({
      level: 'debug',
    });
    const action = {
      secrets: {
        REPO_RAW_ROOT: 'https://127.0.0.1:1234/',
        RESOLVE_GITREF_SERVICE,
      },
      logger,
      request: {
        params: {},
      },
    };
    await resolveRef({}, action);
    const out = await logger.getOutput();
    assert.ok(out.indexOf('unable to resolve ref to non-github repository: https://127.0.0.1:1234/') < 0);
    assert.equal(action.request.params.ref, undefined);
  });

  it('Resolve ignores if RESOLVE_GITREF_SERVICE is missing.', async () => {
    const logger = Logger.getTestLogger({
      level: 'debug',
    });
    await resolveRef({}, {
      secrets: {
        REPO_RAW_ROOT: 'https://raw.github.com/',
      },
      logger,
      request: {
        params: {},
      },
    });
    const out = await logger.getOutput();
    assert.ok(out.indexOf('ignoring github ref resolving. RESOLVE_GITREF_SERVICE is not set.') > 0);
  });

  it('Resolve resolves master ref correctly.', async () => {
    const logger = Logger.getTestLogger({
      level: 'debug',
    });
    const action = {
      secrets: {
        REPO_RAW_ROOT: 'https://raw.github.com/',
        RESOLVE_GITREF_SERVICE,
      },
      logger,
      request: {
        params: {
          owner: 'adobe',
          repo: 'helix-cli',
          ref: 'master',
        },
      },
    };
    await resolveRef({}, action);
    assert.equal(action.request.params.ref, '565cb704628a094edde7e7f87d662b89559adcf0');
  });

  it('Resolve resolves master ref correctly using openwhisk.', async () => {
    const logger = Logger.getTestLogger({
      level: 'debug',
    });
    const action = {
      secrets: {
        REPO_RAW_ROOT: 'https://raw.github.com/',
        RESOLVE_GITREF_SERVICE: SERVICE_ACTION,
      },
      logger,
      request: {
        params: {
          owner: 'adobe',
          repo: 'helix-cli',
          ref: 'master',
        },
      },
    };
    try {
      process.env.__OW_API_HOST = 'https://adobeioruntime.net';
      process.env.__OW_API_KEY = WSK_TOKEN;
      await resolveRef({}, action);
    } finally {
      delete process.env.__OW_API_HOST;
      delete process.env.__OW_API_KEY;
    }
    assert.equal(action.request.params.ref, '565cb704628a094edde7e7f87d662b89559adcf0');
  });

  it('Resolve resolves missing ref as master correctly.', async () => {
    const logger = Logger.getTestLogger({
      level: 'debug',
    });
    const action = {
      secrets: {
        REPO_RAW_ROOT: 'https://raw.github.com/',
        RESOLVE_GITREF_SERVICE,
      },
      logger,
      request: {
        params: {
          owner: 'adobe',
          repo: 'helix-cli',
        },
      },
    };
    await resolveRef({}, action);
    const out = await logger.getOutput();
    assert.ok(out.indexOf('Recoverable error: no ref given for helix-cli/adobe, falling back to master') > 0);
    assert.equal(action.request.params.ref, '565cb704628a094edde7e7f87d662b89559adcf0');
  });

  it('Resolve ignores ref that looks like a SHA.', async () => {
    const logger = Logger.getTestLogger({
      level: 'debug',
    });
    const action = {
      secrets: {
        REPO_RAW_ROOT: 'https://raw.github.com/',
        RESOLVE_GITREF_SERVICE,
      },
      logger,
      request: {
        params: {
          owner: 'adobe',
          repo: 'helix-cli',
          ref: '9932fb0fa5853920d204d368af41c6efb3f7486c',
        },
      },
    };
    await resolveRef({}, action);
    const out = await logger.getOutput();
    assert.ok(out.indexOf('github-ref \'9932fb0fa5853920d204d368af41c6efb3f7486c\' looks like a SHA. Ignoring resolving.') > 0);
    assert.equal(action.request.params.ref, '9932fb0fa5853920d204d368af41c6efb3f7486c');
  });

  it('Handles action error response.', async function test() {
    const { server } = this.polly;
    server
      .get('https://adobeioruntime.net/api/v1/web/helix/helix-services/resolve-git-ref%40v1')
      .intercept((_, res) => res.sendStatus(500));

    const logger = Logger.getTestLogger({
      level: 'debug',
    });
    const action = {
      secrets: {
        REPO_RAW_ROOT: 'https://raw.github.com/',
        RESOLVE_GITREF_SERVICE,
      },
      logger,
      request: {
        params: {
          owner: 'adobe',
          repo: 'helix-cli',
          ref: 'master',
        },
      },
    };
    await resolveRef({}, action);
    const out = await logger.getOutput();
    assert.ok(out.indexOf('unable to resolve github-ref of master: 500 - "Internal Server Error"') > 0);
    assert.equal(action.request.params.ref, 'master');
  });

  it('Refues to invoke openwhisk outside environment.', async () => {
    const logger = Logger.getTestLogger({
      level: 'debug',
    });
    const action = {
      secrets: {
        REPO_RAW_ROOT: 'https://raw.github.com/',
        RESOLVE_GITREF_SERVICE: SERVICE_ACTION,
      },
      logger,
      request: {
        params: {
          owner: 'adobe',
          repo: 'helix-cli',
          ref: 'master',
        },
      },
    };
    await resolveRef({}, action);
    const out = await logger.getOutput();
    assert.ok(out.indexOf('unable to resolve github-ref of master: cannot invoke action outside openwhisk environment.') > 0);
    assert.equal(action.request.params.ref, 'master');
  });

  it('Handles action status error response.', async function test() {
    const { server } = this.polly;
    server
      .get('https://adobeioruntime.net/api/v1/web/helix/helix-services/resolve-git-ref%40v1')
      .intercept((_, res) => {
        res.send({
          status: 'error',
          statusMessage: 'unknown error',
          statusCode: 500,
        });
      });

    const logger = Logger.getTestLogger({
      level: 'debug',
    });
    const action = {
      secrets: {
        REPO_RAW_ROOT: 'https://raw.github.com/',
        RESOLVE_GITREF_SERVICE,
      },
      logger,
      request: {
        params: {
          owner: 'adobe',
          repo: 'helix-cli',
          ref: 'master',
        },
      },
    };
    await resolveRef({}, action);
    const out = await logger.getOutput();
    assert.ok(out.indexOf('unable to resolve github-ref of master: unknown error') > 0);
    assert.equal(action.request.params.ref, 'master');
  });
});
