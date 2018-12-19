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
const winston = require('winston');
const { Polly } = require('@pollyjs/core');
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');
const setupPolly = require('@pollyjs/core').setupMocha;
const fetch = require('../src/html/fetch-markdown');
const coerce = require('../src/utils/coerce-secrets');

const logger = winston.createLogger({
  // tune this for debugging
  level: 'debug',
  // and turn this on if you want the output
  silent: true,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
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
    assert.ok((await fetch(
      {},
      {
        request: { params: { repo: 'xdm', ref: 'master', path: 'README.md' } },
        logger,
      },
    )).error);
  });

  it('Test for missing repo', async () => {
    assert.ok((await fetch(
      {},
      {
        request: { params: { ref: 'master', path: 'README.md', owner: 'adobe' } },
        logger,
      },
    )).error);
  });

  it('Test for missing ref', async () => {
    assert.ok((await fetch(
      {},
      {
        request: { params: { repo: 'xdm', path: 'README.md', owner: 'adobe' } },
        logger,
      },
    )).error);
  });

  it('Test for missing path', async () => {
    assert.ok((await fetch(
      {},
      {
        request: { params: { repo: 'xdm', ref: 'master', owner: 'adobe' } },
        logger,
      },
    )).error);
  });

  it('Test for missing params', async () => {
    assert.ok((await fetch(
      {},
      {
        request: {},
        logger,
      },
    )).error);
  });

  it('Test for missing request', async () => {
    assert.ok((await fetch(
      {},
      { logger },
    )).error);
  });

  it('Test for error pass-through', () => {
    const err = { message: 'this error is mine.' };

    assert.deepEqual(fetch(
      { error: err },
      { logger },
    ), {});
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
        recordingsDir: 'test/fixtures'
      }
    }
  });

  it('Getting XDM README (from wrong URL)', async () => {
    

    const myaction = {
      request: {
        params: {
          repo: 'xdm', ref: 'master', path: 'README.md', owner: 'nobody',
        },
      },
      logger,
    };

    await coerce(myaction);

    assert.ok((await fetch({}, myaction)).error);
  });
});

describe('Test requests', () => {
  setupPolly({
    logging: false,
    recordFailedRequests: false,
    adapters: [NodeHttpAdapter],
    persister: FSPersister,
    persisterOptions: {
      fs: {
        recordingsDir: 'test/fixtures'
      }
    }
  });

  it('Getting XDM README', async () => {
    const myaction = {
      request: {
        params: {
          repo: 'xdm', ref: 'master', path: 'README.md', owner: 'adobe',
        },
      },
      logger,
    };

    await coerce(myaction);

    const result = await fetch({}, myaction);
    assert.ok(result.content.body);
  });
});