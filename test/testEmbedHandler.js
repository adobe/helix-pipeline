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
const { Logger, dom: { assertEquivalentNode } } = require('@adobe/helix-shared');
const { JSDOM } = require('jsdom');
const embed = require('../src/utils/embed-handler');
const { pipe } = require('../src/defaults/html.pipe.js');
const coerce = require('../src/utils/coerce-secrets');

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
  EMBED_SERVICE: 'https://example-embed-service.com/',
};

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});


const crequest = {
  extension: 'html',
  url: '/test/test.html',
};

describe('Test Embed Handler', () => {
  it('Creates ESI', async () => {
    const node = {
      type: 'embed',
      url: 'https://www.example.com/',
    };

    const action = { logger };
    await coerce(action);


    embed(action.secrets)((_, tagname, parameters, children) => {
      assert.equal(parameters.src, 'https://adobeioruntime.net/api/v1/web/helix/helix-services/embed@v1https://www.example.com/');
      assert.equal(children, undefined);
      assert.equal(tagname, 'esi:include');
    }, node);
  });
});


describe('Integration Test with Embeds', () => {
  it('html.pipe does not blow up "embeds" from Helix Not Slides when seeing mailto links', async () => {
    const result = await pipe(
      (context) => {
        context.response = { status: 201, body: context.content.document.body.innerHTML };
      },
      {
        request: crequest,
        content: {
          body: `![](https://raw.githubusercontent.com/trieloff/not-slides/master/01.jpg)

# Bending your Brain for Serverless Success

[Lars Trieloff](mailto:trieloff@adobe.com)`,
        },
      },
      {
        request: { params },
        secrets,
        logger,
      },
    );

    assert.equal(result.response.status, 201);
    assert.equal(result.response.headers['Content-Type'], 'text/html');
    assertEquivalentNode(
      result.response.document.body,
      new JSDOM(`
      <body><p><img src="https://raw.githubusercontent.com/trieloff/not-slides/master/01.jpg"></p>
      <h1 id="bending-your-brain-for-serverless-success">Bending your Brain for Serverless Success</h1>
      <p><a href="mailto:trieloff@adobe.com">Lars Trieloff</a></p></body>
      `).window.document.body,
    );
  });

  it.only('html.pipe does not detect IA "embeds" in normal youtube links', async () => {
    const result = await pipe(
      (context) => {
        context.response = { status: 201, body: context.content.document.body.innerHTML };
      },
      {
        request: crequest,
        content: {
          body: `https://www.youtube.com/watch?balakaka

[https://www.youtube.com/watch?balakaka](https://www.youtube.com/watch?balakaka)

[this cool video](https://www.youtube.com/watch?balakaka)

- [this cool video](https://www.youtube.com/watch?balakaka)
`,
        },
      },
      {
        request: { params },
        secrets,
        logger,
      },
    );

    assert.equal(result.response.status, 201);
    assert.equal(result.response.headers['Content-Type'], 'text/html');
    assert.equal(result.response.document.body.innerHTML.match(/<esi:include/g).length, 2);
  });

  it('html.pipe processes embeds', async () => {
    const result = await pipe(
      (context) => {
        context.response = { status: 201, body: context.content.document.body.innerHTML };
      },
      {
        request: crequest,
        content: {
          body: `Hello World
Here comes an embed.

https://www.youtube.com/watch?v=KOxbO0EI4MA

![Easy!](easy.png)
`,
        },
      },
      {
        request: { params },
        secrets,
        logger,
      },
    );

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

  it('html.pipe processes internal embeds', async () => {
    const result = await pipe(
      (context) => {
        context.response = { status: 201, body: context.content.document.body.innerHTML };
      },
      {
        request: crequest,
        content: {
          body: `Hello World
Here comes an embed.

./foo.md

![Easy!](easy.png)
`,
        },
      },
      {
        request: { params },
        secrets,
        logger,
      },
    );

    assert.equal(result.response.status, 201);
    assert.equal(result.response.headers['Content-Type'], 'text/html');
    assertEquivalentNode(
      result.response.document.body,
      new JSDOM(`
        <p>Hello World
        Here comes an embed.</p>
        <esi:include src="/test/foo.embed.html"></esi:include>
        <esi:remove><p>./foo.md</p></esi:remove>
        <p><img src="easy.png" alt="Easy!"></p>
      `).window.document.body,
    );
  });
});
