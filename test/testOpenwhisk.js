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
const {
  createActionResponse,
  extractClientRequest,
  runPipeline,
} = require('../src/utils/openwhisk.js');
const { pipe, log } = require('../src/defaults/default.js');

describe('Testing OpenWhisk adapter', () => {
  it('createActionResponse keeps response in tact', async () => {
    const inp = {
      response: {
        status: 301,
        headers: {
          Location: 'https://example.com',
        },
        body: null,
      },
    };
    const out = await createActionResponse(inp);
    assert.strictEqual(out.statusCode, 301);
    assert.strictEqual(out.headers.Location, 'https://example.com');
    assert.strictEqual(out.body, null);
  });

  it('createActionResponse provides reasonable defaults for JSON', async () => {
    const inp = {
      response: {
        foo: 'bar',
      },
    };
    const out = await createActionResponse(inp);
    assert.strictEqual(out.statusCode, 200);
    assert.strictEqual(out.headers.Location, undefined);
    assert.strictEqual(out.headers['Content-Type'], 'application/json');
    assert.deepStrictEqual(out.body, {});
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
    const out = await createActionResponse(inp);
    assert.strictEqual(out.statusCode, 200);
    assert.strictEqual(out.headers.Location, undefined);
    assert.strictEqual(out.headers['Content-Type'], 'text/plain');
    assert.deepStrictEqual(out.body, '');
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

  it('openwhisk parameters are properly adapted', async () => {
    const params = {
      __ow_headers: {
        Host: 'example.com',
      },
      __ow_logger: log,
      __ow_method: 'get',
      path: '/test',
      extension: 'html',
      selector: 'print.preview',
      params: 'a=42&b=green',
      SECRET: '1234',
    };
    let action = {};
    let payload = {};
    await runPipeline((p, a) => {
      action = a;
      payload = p;
    }, pipe, params);

    assert.deepEqual(action.request, {
      params: {
        path: '/test',
        extension: 'html',
        selector: 'print.preview',
        params: 'a=42&b=green',
      },
      headers: {
        Host: 'example.com',
      },
      method: 'get',
    });

    assert.deepEqual(action.logger, log);

    assert.deepEqual(action.secrets.SECRET, '1234');

    assert.deepEqual(payload, {
      request: {
        params: {
          a: '42',
          b: 'green',
        },
        headers: {
          Host: 'example.com',
        },
        method: 'get',
        path: '/test',
        extension: 'html',
        selector: 'print.preview',
      },
    });
  });
});
