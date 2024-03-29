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

import assert from 'assert';
import nock from 'nock';
import { ConsoleLogger, SimpleInterface } from '@adobe/helix-log';
import {
  createActionResponse,
  extractActionContext,
  extractClientRequest, runPipeline as runPipelineUniversal,
} from '../src/universal.js';

import { log, pipe } from '../src/defaults/default.js';
import { retrofit, retrofitResponse, universalRequest } from './utils.js';
import pkgJson from '../src/package.cjs';

const runPipeline = retrofit(runPipelineUniversal);

describe('Testing universal adapter', () => {
  afterEach(() => {
    nock.restore();
  });

  beforeEach(() => {
    nock.restore();
    nock.cleanAll();
    nock.activate();
  });

  after('Reset Production Mode', () => {
    // eslint-disable-next-line no-underscore-dangle
    delete process.env.__OW_ACTIVATION_ID;
  });

  it('createActionResponse keeps response intact', async () => {
    const inp = {
      response: {
        status: 301,
        headers: {
          Location: 'https://example.com',
        },
        body: null,
      },
    };
    const out = await retrofitResponse(await createActionResponse(inp));
    assert.deepEqual(out, {
      body: null,
      headers: {
        location: 'https://example.com',
      },
      statusCode: 301,
    });
  });

  it('createActionResponse provides reasonable defaults for JSON', async () => {
    const inp = {
      response: {
        foo: 'bar',
      },
    };
    const out = await retrofitResponse(await createActionResponse(inp));
    assert.deepEqual(out, {
      body: {},
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 200,
    });
  });

  it('createActionResponse provides reasonable defaults for plain text', async () => {
    const inp = {
      response: {
        foo: 'bar',
        headers: {
          'Content-Type': 'text/plain',
        },
      },
    };
    const out = await retrofitResponse(await createActionResponse(inp));
    assert.deepEqual(out, {
      body: '',
      headers: {
        'content-type': 'text/plain',
      },
      statusCode: 200,
    });
  });

  it('createActionResponse propagates error with no http status to openwhisk', async () => {
    const inp = {
      error: new Error('boom!'),
    };
    const out = await retrofitResponse(await createActionResponse(inp));
    assert.ok(out.errorStack.startsWith('Error: boom!'));
    delete out.errorStack;
    assert.deepEqual(out, {
      body: {},
      errorMessage: 'boom!',
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 500,
    });
  });

  it('createActionResponse keeps response intact in case of error', async () => {
    const inp = {
      response: {
        status: 403,
        headers: {
          Location: 'https://example.com',
          'Content-Type': 'text/plain',
        },
        body: 'Forbidden',
      },
      error: new Error('Forbidden'),
    };
    const out = await retrofitResponse(await createActionResponse(inp));
    assert.ok(out.errorStack.startsWith('Error: Forbidden'));
    delete out.errorStack;
    assert.deepEqual(out, {
      body: 'Forbidden',
      errorMessage: 'Forbidden',
      headers: {
        'content-type': 'text/plain',
        location: 'https://example.com',
      },
      statusCode: 403,
    });
  });

  it('Pipeline errors are propagated to action response', async () => {
    const out = await runPipeline(() => {
      // trigger runtime exception
      /* eslint no-undef: 0 */
      foo.bar = 'boom!';
    }, pipe, {});

    assert.ok(out.errorStack.startsWith('ReferenceError: foo is not defined'));
    delete out.errorStack;
    assert.deepEqual(out, {
      body: {},
      errorMessage: 'foo is not defined',
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 500,
    });
  });

  it('extractActionContext creates valid object', () => {
    const params = {
      path: '/test.md',
      extension: 'html',
      selector: 'print.preview',
      params: 'a=42&b=green',
      rootPath: '/docs',
      SECRET: '1234',
    };
    const req = universalRequest({
      __ow_headers: {
        Host: 'example.com',
      },
      __ow_method: 'get',
    });

    const out = extractActionContext(req, { env: {}, resolver: true, log }, params);
    assert.ok(!!out.resolver);
    delete out.resolver;
    assert.deepEqual(out, {
      logger: log,
      request: {
        headers: {
          host: 'example.com',
        },
        method: 'GET',
        params: {
          extension: 'html',
          params: 'a=42&b=green',
          path: '/test.md',
          rootPath: '/docs',
          selector: 'print.preview',
        },
      },
      secrets: {
        SECRET: '1234',
      },
    });
  });

  it('extractActionContext creates valid object with minimal params', () => {
    const out = extractActionContext(universalRequest({}), { env: {}, resolver: true }, {});
    assert.ok(!!out.resolver);
    delete out.resolver;
    assert.deepEqual(out, {
      logger: undefined,
      request: {
        headers: {},
        method: 'GET',
        params: {},
      },
      secrets: {},
    });
  });

  it('extractClientRequest needs to parse params parameter', () => {
    const testObject = {
      foo: 'foo',
      bar: 'bar',
    };
    const out = extractClientRequest({ request: { params: { params: 'foo=foo&bar=bar' } } });
    assert.deepEqual(testObject, out.params, 'request object does not match incoming req');
  });

  it('extractClientRequest acts reasonably on wrong params parameter', () => {
    const out = extractClientRequest({ request: { params: { params: 'this is not url encoded' } } });
    assert.ok(out, 'missing request object');
  });

  it('extractClientRequest acts reasonably with no request object', () => {
    const out = extractClientRequest({});
    assert.ok(out, 'missing request object');
  });

  it('extractClientRequest uses x-old-url correctly', () => {
    const ctx = extractClientRequest({
      request: {
        method: 'get',
        params: {
          extension: 'html',
          owner: 'tripodsan',
          params: 'a=42&b=green',
          path: '/docs/index.md',
          ref: 'master',
          repo: 'hlxtest',
          rootPath: '/api/general',
          selector: '',
        },
        headers: {
          'x-old-url': '/api/general/index.html?a=42&b=green',
          'x-repo-root-path': '/docs',
        },
      },
    });
    assert.deepEqual(ctx, {
      extension: 'html',
      headers: {
        'x-old-url': '/api/general/index.html?a=42&b=green',
        'x-repo-root-path': '/docs',
      },
      method: 'get',
      params: {
        a: '42',
        b: 'green',
      },
      url: '/api/general/index.html?a=42&b=green',
      path: '/api/general/index.html',
      rootPath: '/api/general',
      queryString: '?a=42&b=green',
      pathInfo: '/index.html',
      selector: '',
    });
  });

  it('extractClientRequest is correct with directory', () => {
    const ctx = extractClientRequest({
      request: {
        method: 'get',
        params: {
          extension: 'html',
          owner: 'tripodsan',
          params: '',
          path: '/docs/index.md',
          ref: 'master',
          repo: 'hlxtest',
          rootPath: '/api/general',
          selector: '',
        },
        headers: {
          'x-old-url': '/api/general/',
          'x-repo-root-path': '/docs',
        },
      },
    });
    assert.deepEqual(ctx, {
      extension: 'html',
      headers: {
        'x-old-url': '/api/general/',
        'x-repo-root-path': '/docs',
      },
      method: 'get',
      params: {},
      url: '/api/general/index.html',
      path: '/api/general/index.html',
      queryString: '',
      rootPath: '/api/general',
      pathInfo: '/index.html',
      selector: '',
    });
  });

  it('openwhisk parameters are properly adapted', async () => {
    const params = {
      __ow_headers: {
        Host: 'example.com',
      },
      __ow_logger: log,
      __ow_method: 'get',
      path: '/test.md',
      extension: 'html',
      selector: 'print.preview',
      params: 'a=42&b=green',
      rootPath: '/docs',
      SECRET: '1234',
    };
    let action = {};
    let context = {};
    await runPipeline((p, a) => {
      action = a;
      context = p;
    }, pipe, params);

    assert.deepEqual(action.request, {
      params: {
        path: '/test.md',
        extension: 'html',
        selector: 'print.preview',
        params: 'a=42&b=green',
        rootPath: '/docs',
      },
      headers: {
        host: 'example.com',
      },
      method: 'GET',
    });

    assert.deepEqual(action.logger, log);

    assert.deepEqual(action.secrets.SECRET, '1234');

    assert.deepEqual(context, {
      request: {
        params: {
          a: '42',
          b: 'green',
        },
        headers: {
          host: 'example.com',
        },
        method: 'GET',
        path: '/docs/test.print.preview.html',
        extension: 'html',
        queryString: '?a=42&b=green',
        selector: 'print.preview',
        url: '/docs/test.print.preview.html?a=42&b=green',
        rootPath: '/docs',
        pathInfo: '/test.print.preview.html',
      },
    });
  });

  it.skip('openwhisk adds JSON content from post request to context', async () => {
    const params = {
      __ow_headers: {
        'content-type': 'application/json',
      },
      __ow_logger: log,
      __ow_method: 'post',
    };
    let context = {};

    // passes JSON content from post request to context
    params.content = {
      body: '# Foo',
    };

    await runPipeline((p) => {
      context = p;
    }, pipe, params);

    assert.deepEqual(context.content, params.content);
  });

  it('pipeline responds to status check', async () => {
    const params = {
      __ow_logger: log,
      __ow_method: 'get',
      __ow_path: '/_status_check/healthcheck.json',
    };

    const ret = await runPipeline(() => {}, pipe, params);
    delete ret.body.response_time;
    delete ret.body.process;
    assert.deepEqual(ret, {
      body: {
        status: 'OK',
        version: pkgJson.version,
      },
      headers: {
        'content-type': 'application/json',
        'x-version': pkgJson.version,
      },
      statusCode: 200,
    });
  });

  it('it logs to coralogix if secrets are present', async () => {
    const reqs = [];

    nock('https://api.coralogix.com/api/v1/')
      .post('/logs')
      .reply((uri, requestBody) => {
        reqs.push(requestBody);
        return [200, 'ok'];
      });

    const params = {
      __ow_headers: {
        'content-type': 'application/json',
      },
      __ow_method: 'get',
    };

    const env = {
      CORALOGIX_API_KEY: '1234',
      CORALOGIX_APPLICATION_NAME: 'logger-test',
      CORALOGIX_SUBSYSTEM_NAME: 'test-1',
      CORALOGIX_LOG_LEVEL: 'info',
    };

    let logger;
    await runPipeline((context, action) => {
      action.logger.infoFields('Hello, world', { myId: 42 });
      logger = action.logger;
    }, pipe, params, env);

    await logger.flush();

    // nock 13.x needs a bit to respond with the correct reply.
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });

    assert.equal(reqs.length, 1);
    assert.equal(reqs[0].applicationName, 'logger-test');
    assert.equal(reqs[0].subsystemName, 'test-1');
    assert.equal(reqs[0].privateKey, '1234');
    assert.equal(reqs[0].logEntries.length, 1);

    const logEntry = JSON.parse(reqs[0].logEntries[0].text);
    delete logEntry.timestamp;
    assert.deepEqual(logEntry, {
      level: 'info',
      message: 'Hello, world',
      myId: 42,
      inv: {
        functionName: '/pages_4.3.1/html/4.3.1',
        invocationId: '1234',
        requestId: 'rq334',
        transactionId: 'tx556',
      },
    });
  });

  it('it logs even if no trace logging', async () => {
    const winstonLogger = new SimpleInterface({
      level: 'debug',
      logger: new ConsoleLogger(),
    });
    winstonLogger.trace = undefined;

    const params = {
      __ow_headers: {
        'content-type': 'application/json',
      },
      __ow_method: 'get',
      __ow_logger: winstonLogger,
    };
    process.env.__OW_ACTIVATION_ID = 'test-my-activation-id';
    const ret = await runPipeline((context, action) => {
      action.logger.trace({ myId: 42 }, 'Hello, world');
    }, pipe, params);

    assert.deepEqual(ret, {
      body: {},
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 200,
    });
  });
});
