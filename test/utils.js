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

const path = require('path');
const querystring = require('querystring');
const { Request } = require('@adobe/helix-fetch');
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');
const { setupMocha } = require('@pollyjs/core');
const { VersionLock } = require('@adobe/openwhisk-action-utils');
const { pipe: htmlPipe } = require('../src/defaults/html.pipe.js');
const { pipe: jsonPipe } = require('../src/defaults/json.pipe.js');
const { pipe: xmlPipe } = require('../src/defaults/xml.pipe.js');
const Downloader = require('../src/utils/Downloader.js');

const resolver = {
  createURL({ package, name, version }) {
    const namespace = process.env.__OW_NAMESPACE || 'helix';
    return new URL(`https://adobeioruntime.net/api/v1/web/${namespace}/${package}/${name}@${version}`);
  },
};

function piper(pipe, universal) {
  return (cont, context, action) => {
    action.downloader = new Downloader(context, action, { forceHttp1: true });
    if (universal) {
      action.resolver = resolver;
    } else {
      action.versionLock = new VersionLock();
    }
    return pipe(cont, context, action);
  };
}

function setupPolly(opts) {
  setupMocha({
    logging: false,
    recordFailedRequests: true,
    recordIfMissing: false,
    matchRequestsBy: {
      headers: {
        exclude: ['authorization', 'accept-encoding', 'user-agent', 'accept', 'connection', 'x-request-id'],
      },
    },
    adapters: [NodeHttpAdapter],
    persister: FSPersister,
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, 'fixtures'),
      },
    },
    ...opts,
  });
}

async function retrofitResponse(resp) {
  let body;
  if (resp.body === null) {
    body = null;
  } else {
    body = await resp.text();
    try {
      body = JSON.parse(body);
    } catch {
      // ignore
    }
  }
  const ret = {
    statusCode: resp.status,
    body,
    headers: [...resp.headers.keys()].reduce((result, key) => {
      // eslint-disable-next-line no-param-reassign
      result[key] = resp.headers.get(key);
      return result;
    }, {}),
  };
  if (resp.errorStack) {
    ret.errorStack = resp.errorStack;
  }
  if (resp.errorMessage) {
    ret.errorMessage = resp.errorMessage;
  }
  return ret;
}

function universalRequest(params) {
  const {
    __ow_headers: headers = {},
    __ow_method: method = 'get',
    // eslint-disable-next-line no-unused-vars
    __ow_logger: _logger,
    // eslint-disable-next-line no-unused-vars
    __ow_path: _path,
    ...rest
  } = params;
  return new Request(`https://universal.com/action?${querystring.encode(rest)}`, {
    headers,
    method,
  });
}

function retrofit(fn) {
  return async (cont, p, params = {}, env = {}) => {
    const req = universalRequest(params);
    const suffix = params.__ow_path || '';
    const resp = await fn(cont, p, req, {
      resolver,
      env,
      log: params.__ow_logger,
      pathInfo: {
        suffix,
      },
      func: {
        name: 'html',
        version: '4.3.1',
        package: 'pages_4.3.1',
      },
      invocation: {
        id: '1234',
        requestId: 'rq334',
        transactionId: 'tx556',
      },
    });
    return retrofitResponse(resp);
  };
}

module.exports = {
  retrofit,
  retrofitResponse,
  universalRequest,
  pipe: piper(htmlPipe),
  pipeUniversal: piper(htmlPipe, true),
  jsonPipe: piper(jsonPipe),
  xmlPipe: piper(xmlPipe),
  resolver,
  setupPolly,
};
