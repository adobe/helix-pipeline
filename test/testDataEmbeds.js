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

  async function testEmbeds(data, markdown, html, status = 200) {
    nock('https://raw.githubusercontent.com')
      .get('/adobe/test-repo/master/fstab.yaml')
      .reply(() => [404]);

    nock('https://adobeioruntime.net')
      .get(/.*/)
      .reply(() => [status, data]);

    const action = coerce({
      request: { params },
      secrets,
      logger,
    });

    const context = {
      request: crequest,
      content: {
        body: markdown,
      },
    };

    action.downloader = new Downloader(context, action, { forceHttp1: true });
    action.logger = logger;

    const result = await pipe(
      (mycontext) => {
        mycontext.response = { status: 200, body: mycontext.content.document.body.innerHTML };
      },
      context,
      action,
    );
    assert.equal(result.response.status, 200, result.error);
    assert.equal(result.response.headers['Content-Type'], 'text/html');
    assertEquivalentNode(
      result.response.document.body,
      new JSDOM(html).window.document.body,
    );
  }
  it('html.pipe processes data embeds in main document', async () => testEmbeds(
    [
      {
        make: 'Nissan', model: 'Sunny', year: 1992, image: 'nissan.jpg',
      },
      {
        make: 'Renault', model: 'Scenic', year: 2000, image: 'renault.jpg',
      },
      {
        make: 'Honda', model: 'FR-V', year: 2005, image: 'honda.png',
      },
    ],
    `
https://docs.google.com/spreadsheets/d/e/2PACX-1vQ78BeYUV4gFee4bSxjN8u86aV853LGYZlwv1jAUMZFnPn5TnIZteDJwjGr2GNu--zgnpTY1E_KHXcF/pubhtml

1. My car: [![{{make}} {{model}}]({{image}})](cars-{{year}}.md)`,
    `<ol>
    <li>My car:<a href="cars-1992.html"><img src="nissan.jpg" alt="Nissan Sunny"></a></li>
    <li>My car:<a href="cars-2000.html"><img src="renault.jpg" alt="Renault Scenic"></a></li>
    <li>My car:<a href="cars-2005.html"><img src="honda.png" alt="Honda FR-V"></a></li>
  </ol>`,
  ));

  it('html.pipe processes data embeds with dot notation', async () => testEmbeds(
    [
      {
        make: 'Nissan', model: 'Sunny', year: 1992, image: 'nissan.jpg', mileage: { from: 100000, to: 150000 },
      },
      {
        make: 'Renault', model: 'Scenic', year: 2000, image: 'renault.jpg', mileage: { from: 75000, to: 100000 },
      },
      {
        make: 'Honda', model: 'FR-V', year: 2005, image: 'honda.png', mileage: { from: 50000, to: 150000 },
      },
    ],
    `
https://docs.google.com/spreadsheets/d/e/2PACX-1vQ78BeYUV4gFee4bSxjN8u86aV853LGYZlwv1jAUMZFnPn5TnIZteDJwjGr2GNu--zgnpTY1E_KHXcF/pubhtml

# My {{make}} {{model}}

![{{make}} {{model}}]({{image}})

Built in {{year}}. Driven from {{mileage.from}} km to {{mileage.to}} km.
`,
    `<h1 id="my-nissan-sunny">My Nissan Sunny</h1>
    <p><img src="nissan.jpg" alt="Nissan Sunny"></p>
    <p>Built in 1992. Driven from 100000 km to 150000 km.</p>

    <h1 id="my-renault-scenic">My Renault Scenic</h1>
    <p><img src="renault.jpg" alt="Renault Scenic"></p>
    <p>Built in 2000. Driven from 75000 km to 100000 km.</p>
    
    <h1 id="my-honda-fr-v">My Honda FR-V</h1>
    <p><img src="honda.png" alt="Honda FR-V"></p>
    <p>Built in 2005. Driven from 50000 km to 150000 km.</p>`,
  ));

  it('html.pipe processes data embeds in sections', async () => testEmbeds(
    [
      {
        make: 'Nissan', model: 'Sunny', year: 1992, image: 'nissan.jpg',
      },
      {
        make: 'Renault', model: 'Scenic', year: 2000, image: 'renault.jpg',
      },
      {
        make: 'Honda', model: 'FR-V', year: 2005, image: 'honda.png',
      },
    ],
    `
## My Cars

---

https://docs.google.com/spreadsheets/d/e/2PACX-1vQ78BeYUV4gFee4bSxjN8u86aV853LGYZlwv1jAUMZFnPn5TnIZteDJwjGr2GNu--zgnpTY1E_KHXcF/pubhtml

- [![{{make}} {{model}}]({{image}})](cars-{{year}}.md)
`,
    `<div>
      <h2 id="my-cars">My Cars</h2>
    </div>
    <div>
      <ul>
        <li><a href="cars-1992.html"><img src="nissan.jpg" alt="Nissan Sunny"></a></li>
        <li><a href="cars-2000.html"><img src="renault.jpg" alt="Renault Scenic"></a></li>
        <li><a href="cars-2005.html"><img src="honda.png" alt="Honda FR-V"></a></li>
      </ul>
    </div>`,
  ));
});
