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
const { setupPolly, pipe } = require('./utils.js');

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

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
};

const crequest = {
  extension: 'html',
  url: '/test/test.html',
};

describe('Testing HTML Pipeline in Production', () => {
  setupPolly({
    recordIfMissing: false,
  });

  let production;
  before('Fake Production Mode', () => {
    // eslint-disable-next-line no-underscore-dangle
    production = process.env.__OW_ACTIVATION_ID;
    // eslint-disable-next-line no-underscore-dangle
    process.env.__OW_ACTIVATION_ID = 'fake';
  });

  it('html.pipe adds headers from meta tags', async () => {
    const result = await pipe(
      (context) => {
        context.response = {
          status: 201,
          headers: {
            Foo: 'bar',
          },
          body: `<html>
  <head>
    <title>Hello World</title>
    <meta http-equiv="Expires" content="3000">
    <meta http-equiv="Foo" content="baz">
    <meta http-equiv="Exceeds" value="3000">
    <meta http-equiv="Link" content="</some_image.jpeg>; rel=preload; as=image" />
  </head>
  <body>
    ${context.content.document.body.innerHTML}
  </body>
</html>`,
        };
      },
      {
        request: crequest,
        content: {
          body: 'Hello World',
        },
      },
      {
        request: { params },
        secrets,
        logger,
      },
    );

    assert.equal(result.response.status, 201);
    assert.equal(result.response.headers['Content-Type'], 'text/html', 'keeps content-type');
    assert.equal(result.response.headers.Expires, '3000', 'allows setting through meta http-equiv');
    assert.equal(result.response.headers.Exceeds, undefined, 'ignores invalid meta tags');
    assert.equal(result.response.headers.Foo, 'bar', 'does not override existing headers');
    assert.equal(result.response.headers.Link, '</some_image.jpeg>; rel=preload; as=image', 'allows setting Link header through meta http-equiv');
  });

  it('html.pipe adds headers from link tags', async () => {
    const result = await pipe(
      (context) => {
        context.response = {
          status: 201,
          headers: {
            Foo: 'bar',
          },
          body: `<html>
  <head>
    <title>Hello World</title>
    <link rel="next" href="next.html" />
    <link rel="stylesheet" href="style.css" />
    <link rel="first" href="index.html" />
    <link rel="previous" src="previous.html" />
  </head>
  <body>
    ${context.content.document.body.innerHTML}
  </body>
</html>`,
        };
      },
      {
        request: crequest,
        content: {
          body: 'Hello World',
        },
      },
      {
        request: { params },
        secrets,
        logger,
      },
    );

    assert.equal(result.response.status, 201);
    assert.equal(result.response.headers['X-ESI'], 'enabled', 'detects ESI');
    assert.equal(result.response.headers.Link, '<next.html>; rel="next",<index.html>; rel="first"', 'allows setting through link');
  });

  // enable once 'as' attribute is handled by JSDOM: https://github.com/jsdom/jsdom/issues/2471
  // see issue #520
  it.skip('html.pipe propagates \'as\' attribute of link tags', async () => {
    const result = await pipe(
      (context) => {
        context.response = {
          status: 201,
          headers: {
            Foo: 'bar',
          },
          body: `<html>
  <head>
    <link rel="preload" href="/some_image.jpeg" as="image" />
    <link rel="preload" href="/some_lib.js" as="script" />
  </head>
  <body>
    ${context.content.document.body.innerHTML}
  </body>
</html>`,
        };
      },
      {
        request: crequest,
        content: {
          body: 'Hello World',
        },
      },
      {
        request: { params },
        secrets,
        logger,
      },
    );

    assert.equal(result.response.status, 201);
    assert.equal(result.response.headers.Link, '</some_image.jpeg>; rel=preload; as=image,</some_lib.js>; rel=preload; as=script', 'allows setting Link header through meta http-equiv');
  });

  after('Reset Production Mode', () => {
    // eslint-disable-next-line no-underscore-dangle
    process.env.__OW_ACTIVATION_ID = production;
  });
});
