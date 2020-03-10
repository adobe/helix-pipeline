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
const { dom: { assertEquivalentNode } } = require('@adobe/helix-shared');
const { logging } = require('@adobe/helix-testutils');
const nock = require('nock');
const { JSDOM } = require('jsdom');
const { pipe } = require('../src/defaults/html.pipe.js');
const coerce = require('../src/utils/coerce-secrets');
const Downloader = require('../src/utils/Downloader.js');

const params = {
  path: '/hello.md',
  __ow_method: 'get',
  owner: 'trieloff',
  __ow_headers: {
    'X-Forwarded-Port': '443',
    'X-CDN-Request-Id': '2a208a89-e071-44cf-aee9-220880da4c1e',
    'Fastly-Client': '1',
    'X-Forwarded-Host': 'runtime.adobe.io',
    'Upgrade-Insecure-Requests': '1',
    Host: 'controller-a',
    Connection: 'close',
    'Fastly-SSL': '1',
    'X-Request-Id': 'RUss5tPdgOfw74a68aNc24FeTipGpVfW',
    'X-Branch': 'master',
    'Accept-Language': 'en-US, en;q=0.9, de;q=0.8',
    'X-Forwarded-Proto': 'https',
    'Fastly-Orig-Accept-Encoding': 'gzip',
    'X-Varnish': '267021320',
    DNT: '1',
    'X-Forwarded-For':
      '192.147.117.11, 157.52.92.27, 23.235.46.33, 10.64.221.107',
    'X-Host': 'www.primordialsoup.life',
    Accept:
      'text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, image/apng, */*;q=0.8',
    'X-Real-IP': '10.64.221.107',
    'X-Forwarded-Server': 'cache-lcy19249-LCY, cache-iad2127-IAD',
    'Fastly-Client-IP': '192.147.117.11',
    'Perf-Br-Req-In': '1529585370.116',
    'X-Timer': 'S1529585370.068237,VS0,VS0',
    'Fastly-FF':
      'dc/x3e9z8KMmlHLQr8BEvVMmTcpl3y2YY5y6gjSJa3g=!LCY!cache-lcy19249-LCY, dc/x3e9z8KMmlHLQr8BEvVMmTcpl3y2YY5y6gjSJa3g=!LCY!cache-lcy19227-LCY, dc/x3e9z8KMmlHLQr8BEvVMmTcpl3y2YY5y6gjSJa3g=!IAD!cache-iad2127-IAD, dc/x3e9z8KMmlHLQr8BEvVMmTcpl3y2YY5y6gjSJa3g=!IAD!cache-iad2133-IAD',
    'Accept-Encoding': 'gzip',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
  },
  repo: 'soupdemo',
  ref: 'master',
  selector: 'md',
};

const secrets = {
  REPO_RAW_ROOT: 'https://raw.githubusercontent.com/',
  EMBED_WHITELIST: '*.youtube.com',
  DATA_EMBED_WHITELIST: 'docs.google.com',
};

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'debug',
});


const crequest = {
  extension: 'html',
  url: '/test/test.html',
};

describe('Integration Test with Data Embeds', () => {
  afterEach(() => {
    nock.restore();
  });

  beforeEach(() => {
    nock.restore();
    nock.activate();
    nock.cleanAll();
  });

  it('html.pipe processes data embeds', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/fstab.yaml')
      .reply(() => {
        console.log('fstab');
        return 404;
      });

    nock('https://adobeioruntime.net')
      .get(/.*/)
      .reply(() => {
        // this never happens
        console.log('intercepting runtime');
        return 404;
      });

    const action = coerce({
      request: { params },
      secrets,
      logger,
    });

    const context = {
      request: crequest,
      content: {
        body: `Hello World
Here comes a data embed.

https://docs.google.com/spreadsheets/d/e/2PACX-1vQ78BeYUV4gFee4bSxjN8u86aV853LGYZlwv1jAUMZFnPn5TnIZteDJwjGr2GNu--zgnpTY1E_KHXcF/pubhtml

![Easy!](easy.png)
`,
      },
    };

    action.downloader = new Downloader(context, action, { forceHttp1: true });

    const result = await pipe(
      (mycontext) => {
        mycontext.response = { status: 201, body: mycontext.content.document.body.innerHTML };
      },
      context,
      action,
    );

    console.log(result.content.mdast);

    console.log(result.response);
    assert.equal(result.response.status, 201);
    assert.equal(result.response.headers['Content-Type'], 'text/html');
    assertEquivalentNode(
      result.response.document.body,
      new JSDOM(`
        <p>Hello World
        Here comes an embed.</p>
        <esi:include src="https://example-embed-service.com/https://www.youtube.com/watch?v=KOxbO0EI4MA"></esi:include>
        <esi:remove><p><a href="https://www.youtube.com/watch?v=KOxbO0EI4MA">https://www.youtube.com/watch?v=KOxbO0EI4MA</a></p></esi:remove>
        <p><img src="easy.png" alt="Easy!"></p>
      `).window.document.body,
    );
  });
});
