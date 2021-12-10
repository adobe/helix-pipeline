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

import path from 'path';
import querystring from 'querystring';
import { Request } from '@adobe/helix-fetch';
import NodeHttpAdapter from '@pollyjs/adapter-node-http';
import FSPersister from '@pollyjs/persister-fs';
import { setupMocha } from '@pollyjs/core';
import { pipe as rawHtmlPipe } from '../src/defaults/html.pipe.js';
import { pipe as rawJsonPipe } from '../src/defaults/json.pipe.js';
import { pipe as rawXmlPipe } from '../src/defaults/xml.pipe.js';
import Downloader from '../src/utils/Downloader.js';

export const resolver = {
  createURL({ package: pkg, name, version }) {
    const namespace = process.env.__OW_NAMESPACE || 'helix';
    return new URL(`https://adobeioruntime.net/api/v1/web/${namespace}/${pkg}/${name}@${version}`);
  },
};

function piper(pipe) {
  return (cont, context, action) => {
    action.downloader = new Downloader(context, action, { forceHttp1: true });
    action.resolver = resolver;
    return pipe(cont, context, action);
  };
}

export function setupPolly(opts) {
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
        recordingsDir: path.resolve(__testdir, 'fixtures'),
      },
    },
    ...opts,
  });
}

export async function retrofitResponse(resp) {
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

export function universalRequest(params) {
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

export function retrofit(fn) {
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

export const pipe = piper(rawHtmlPipe);
export const jsonPipe = piper(rawJsonPipe);
export const xmlPipe = piper(rawXmlPipe);
