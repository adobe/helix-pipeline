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
import assert from 'assert';
import { logging } from '@adobe/helix-testutils';
import nock from 'nock';
import coerce from '../src/html/coerce-secrets.js';
import Downloader from '../src/utils/Downloader.js';

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

describe('Test URI parsing and construction', () => {
  function compute(root, owner, repo, ref, path) {
    const mgr = new Downloader({}, {
      secrets: {
        REPO_RAW_ROOT: root,
        HTTP_TIMEOUT: 1000,
      },
    });
    return mgr.computeGithubURI(owner, repo, ref, path);
  }

  it('computeGithubURI constructs URIs', () => {
    assert.equal(
      compute(
        'https://raw.githubusercontent.com',
        'adobe',
        'xdm',
        'master',
        'README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/master/README.md',
    );
  });

  it('computeGithubURI deals with trailing slashes', () => {
    assert.equal(
      compute(
        'https://raw.githubusercontent.com/',
        'adobe',
        'xdm',
        'master',
        'README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/master/README.md',
    );
  });

  it('computeGithubURI deals with leading slashes', () => {
    assert.equal(
      compute(
        'https://raw.githubusercontent.com',
        'adobe',
        'xdm',
        'master',
        '/README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/master/README.md',
    );
  });

  it('computeGithubURI deals with slashes in refs', () => {
    assert.equal(
      compute(
        'https://raw.githubusercontent.com',
        'adobe',
        'xdm',
        'tags/release_1',
        '/README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/tags/release_1/README.md',
    );
  });

  it('computeGithubURI deals with ugly slashes in refs', () => {
    assert.equal(
      compute(
        'https://raw.githubusercontent.com',
        'adobe',
        'xdm',
        '/tags/release_1/',
        '/README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/tags/release_1/README.md',
    );
  });

  it('computeGithubURI deals with ugly slashes in owner', () => {
    assert.equal(
      compute(
        'https://raw.githubusercontent.com',
        '/adobe/',
        'xdm',
        'tags/release_1',
        '/README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/tags/release_1/README.md',
    );
  });

  it('computeGithubURI deals with ugly slashes in repo', () => {
    assert.equal(
      compute(
        'https://raw.githubusercontent.com',
        'adobe',
        '/xdm/',
        'tags/release_1',
        '/README.md',
      ),
      'https://raw.githubusercontent.com/adobe/xdm/tags/release_1/README.md',
    );
  });

  it('computeGithubURI generates github pages uri', () => {
    assert.equal(
      compute(
        'https://raw.githubusercontent.com',
        'adobe',
        '/xdm/',
        'gh-pages',
        '/README.md',
      ),
      'https://adobe.github.io/xdm/README.md',
    );
  });
});

describe('Test input validation', () => {
  afterEach(() => {
    nock.restore();
  });

  beforeEach(() => {
    nock.restore();
    nock.activate();
    nock.cleanAll();
  });

  it('fetch fails if no uri', () => {
    const action = coerce({
      logger,
    });
    const mgr = new Downloader({}, action);
    assert.rejects(async () => mgr.fetch({}), Error('Unknown uri, cannot fetch content'));
  });

  it('fetchGithub fails if no owner', () => {
    const action = coerce({
      logger,
    });
    const mgr = new Downloader({}, action);
    assert.rejects(async () => mgr.fetchGithub({}), Error('Unknown owner, cannot fetch content'));
  });

  it('fetchGithub fails if no repo', () => {
    const action = coerce({
      logger,
    });
    const mgr = new Downloader({}, action);
    assert.rejects(async () => mgr.fetchGithub({
      owner: 'adobe',
    }), Error('Unknown repo, cannot fetch content'));
  });

  it('fetchGithub fails if no path', () => {
    const action = coerce({
      logger,
    });
    const mgr = new Downloader({}, action);
    assert.rejects(async () => mgr.fetchGithub({
      owner: 'adobe',
      repo: 'test-repo',
    }), Error('Unknown path, cannot fetch content'));
  });

  it('fetchGithub warns if no HTTP_TIMEOUT', () => {
    const testLogger = logging.createTestLogger({
      // tune this for debugging
      level: 'info',
    });

    // eslint-disable-next-line no-new
    new Downloader({}, {
      secrets: {},
      logger: testLogger,
    });
    assert.strictEqual(testLogger.getOutput(), 'warn: No HTTP timeout set, risk of denial-of-service\n');
  });
});

describe('Test Download', () => {
  afterEach(() => {
    nock.restore();
  });

  beforeEach(() => {
    nock.restore();
    nock.activate();
    nock.cleanAll();
  });

  it('can suppress 404 error.', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/development/myfile1.md')
      .reply(() => [404, 'not found']);

    const context = {};
    const action = coerce({
      logger,
    });

    const mgr = new Downloader(context, action, {
      forceNoCache: true,
      forceHttp1: true,
    });
    const res = await mgr.fetchGithub({
      owner: 'adobe',
      repo: 'test-repo',
      ref: 'development',
      path: '/myfile1.md',
      errorOn404: false,
    });

    assert.equal(res.ok, false);
    assert.equal(res.status, 404);
    assert.equal(await res.text(), 'not found');
    assert.equal(context.error, undefined);

    mgr.destroy();
  });

  it('throws on 404 error if desired.', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/development/myfile1.md')
      .reply(() => [404, 'not found']);

    const context = {};
    const action = coerce({
      logger,
    });

    const mgr = new Downloader(context, action, {
      forceNoCache: true,
      forceHttp1: true,
    });
    try {
      await mgr.fetchGithub({
        owner: 'adobe',
        repo: 'test-repo',
        ref: 'development',
        path: '/myfile1.md',
        errorOn404: true,
      });
      assert.fail('should throw error.');
    } catch (err) {
      const expected = 'Error while fetching file from https://raw.githubusercontent.com/adobe/test-repo/development/myfile1.md: 404';
      assert.equal(err.message, expected);
      assert.equal(err.status, 404);
      assert.equal(context.error.message, expected);
    }

    mgr.destroy();
  });

  it('can schedule downloads in parallel', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/development/myfile1.md')
      .delay(30)
      .reply(() => [200, 'hello, world 1.'])
      .get('/adobe/test-repo/development/myfile2.md')
      .delay(20)
      .reply(() => [200, 'hello, world 2.'])
      .get('/adobe/test-repo/development/myfile3.md')
      .delay(10)
      .reply(() => [200, 'hello, world 3.']);

    nock('https://www.example.com')
      .get('/data')
      .delay(30)
      .reply(() => [200, 'hello, world 4.']);

    const action = coerce({
      logger,
    });
    const mgr = new Downloader({}, action, {
      forceNoCache: true,
      forceHttp1: true,
    });
    ['/myfile1.md', '/myfile2.md', '/myfile3.md'].forEach((path) => {
      mgr.fetchGithub({
        owner: 'adobe',
        repo: 'test-repo',
        ref: 'development',
        path,
        id: path,
      });
    });

    mgr.fetch({
      uri: 'https://www.example.com/data',
    });

    const results = await Promise.all(mgr.tasks);
    for (let i = 0; i < results.length; i += 1) {
      const res = results[i];
      assert.equal(res.body, `hello, world ${i + 1}.`);
      assert.equal(res.status, 200);
    }

    mgr.destroy();
  });

  it('can retrieve a task by id', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/development/myfile1.md')
      .reply(() => [200, 'hello, world 1.']);

    const action = coerce({
      logger,
    });
    const mgr = new Downloader({}, action, {
      forceNoCache: true,
      forceHttp1: true,
    });
    mgr.fetchGithub({
      owner: 'adobe',
      repo: 'test-repo',
      ref: 'development',
      path: '/myfile1.md',
      id: 'test-id',
    });

    // get task by id
    const task = mgr.getTaskById('test-id');
    const res = await task;
    assert.equal(res.status, 200);
    assert.equal(res.body, 'hello, world 1.');

    mgr.destroy();
  });

  it('caches response', async () => {
    const scope = nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/development/myfile1.md')
      .reply(() => [200, 'hello, world 1.', {
        'cache-control': 'max-age=60',
      }]);

    const action = coerce({
      logger,
    });
    const mgr = new Downloader({}, action, {
      forceHttp1: true,
    });
    const r1 = await mgr.fetchGithub({
      owner: 'adobe',
      repo: 'test-repo',
      ref: 'development',
      path: '/myfile1.md',
      id: 'test-id',
    });
    const r2 = await mgr.fetchGithub({
      owner: 'adobe',
      repo: 'test-repo',
      ref: 'development',
      path: '/myfile1.md',
      id: 'test-id',
    });

    assert.equal(r1.status, 200);
    assert.equal(r2.status, 200);
    assert.equal(r1.body, 'hello, world 1.');
    assert.equal(r2.body, 'hello, world 1.');

    scope.done();

    mgr.destroy();
  });

  it('can disable cache response', async () => {
    const scope = nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/development/myfile1.md')
      .twice()
      .reply(() => [200, 'hello, world 1.', {
        'cache-control': 'max-age=60',
      }]);

    const action = coerce({
      logger,
    });
    const mgr = new Downloader({}, action, {
      forceNoCache: true,
      forceHttp1: true,
    });
    const r1 = await mgr.fetchGithub({
      owner: 'adobe',
      repo: 'test-repo',
      ref: 'development',
      path: '/myfile1.md',
      id: 'test-id',
    });
    const r2 = await mgr.fetchGithub({
      owner: 'adobe',
      repo: 'test-repo',
      ref: 'development',
      path: '/myfile1.md',
      id: 'test-id',
    });

    assert.equal(r1.status, 200);
    assert.equal(r2.status, 200);
    assert.equal(r1.body, 'hello, world 1.');
    assert.equal(r2.body, 'hello, world 1.');

    scope.done();

    mgr.destroy();
  });

  it('forward default headers only', async () => {
    const scope = nock('https://www.example.com', {
      reqheaders: {
        'x-cdn-url': 'cdn url',
        'x-request-id': 'request id',
      },
      badheaders: ['x-not-forward'],
    })
      .get('/data')
      .reply(() => [200, 'hello, world 4.']);

    const action = coerce({
      logger,
      request: {
        headers: {
          'x-cdn-url': 'cdn url',
          'x-request-id': 'request id',
          'x-not-forward': 'should not forward',
        },
      },
    });
    const mgr = new Downloader({}, action, {
      forceNoCache: true,
      forceHttp1: true,
    });

    await mgr.fetch({
      uri: 'https://www.example.com/data',
    });

    scope.done();

    mgr.destroy();
  });

  it('forwards the transaction id', async () => {
    const scope = nock('https://www.example.com', {
      reqheaders: {
        'x-cdn-url': 'cdn url',
        'x-request-id': 'my-transaction',
      },
      badheaders: ['x-not-forward'],
    })
      .get('/data')
      .reply(() => [200, 'hello, world 4.']);

    const action = coerce({
      logger,
      request: {
        headers: {
          'x-cdn-url': 'cdn url',
          'x-not-forward': 'should not forward',
        },
      },
    });
    try {
      process.env.__OW_TRANSACTION_ID = 'my-transaction';
      const mgr = new Downloader({}, action, {
        forceNoCache: true,
        forceHttp1: true,
      });
      await mgr.fetch({
        uri: 'https://www.example.com/data',
      });
      scope.done();
      mgr.destroy();
    } finally {
      delete process.env.__OW_TRANSACTION_ID;
    }
  });

  it('forward only specified headers', async () => {
    const scope = nock('https://www.example.com', {
      reqheaders: {
        'x-forward': 'should forward',
      },
      badheaders: ['x-not-forward', 'x-cdn-url', 'x-request-id'],
    })
      .get('/data')
      .reply(() => [200, 'hello, world 4.']);

    const action = coerce({
      logger,
      request: {
        headers: {
          'x-cdn-url': 'cdn url',
          'x-request-id': 'request id',
          'x-not-forward': 'should not forward',
          'x-forward': 'should forward',
        },
      },
    });
    const mgr = new Downloader({}, action, {
      forceNoCache: true,
      forceHttp1: true,
    });

    await mgr.fetch({
      uri: 'https://www.example.com/data',
      forwardHeaders: ['x-forward'],
    });

    scope.done();

    mgr.destroy();
  });
});
