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

const { logging } = require('@adobe/helix-testutils');
const { JSDOM } = require('jsdom');
const { multiline } = require('@adobe/helix-shared').string;
const { assertEquivalentNode } = require('@adobe/helix-shared').dom;
const { setupPolly, pipe } = require('./utils.js');

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

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

const crequest = {
  extension: 'html',
  url: '/test/test.html',
};

/**
 * Assert that a specific html dom is generated from the given markdown
 * using our html pipeline.
 *
 * The comparison between generated html and given html is done on dom
 * level, so differences not affecting the html (like most whitespace)
 * are ignored.
 *
 * @param {String} md The markdown to convert to html.
 * @param {String} html The html we expect to be generated.
 * @param {*} secrets additional secrets to add to the action
 */
const assertMd = async (md, html, secrets = {}) => {
  const fromHTML = (context) => {
    context.response = {
      status: 201,
      body: context.content.document.body.innerHTML,
    };
  };

  const generated = await pipe(
    fromHTML,
    { content: { body: multiline(md) }, request: crequest },
    {
      logger,
      request: { params },
      secrets,
    },
  );

  // check equality of the dom, but throw assertion based on strings to visualize difference.
  const act = new JSDOM(generated.response.body);
  const exp = new JSDOM(html);
  assertEquivalentNode(act.window.document.body, exp.window.document.body);
};

describe('Testing HTML Pipeline (Links)', () => {
  setupPolly({
    recordIfMissing: false,
  });

  beforeEach(function beforeEach() {
    this.polly.server
      .host('https://raw.githubusercontent.com', () => {
        this.polly.server.get('/trieloff/soupdemo/master/helix-markup.yaml')
          .intercept((req, res) => {
            res.status(404).send();
          });
      });
  });

  it('Renders absolute links', async () => {
    await assertMd(
      '[Absolute](/folder/file.md)',
      '<p><a href="/folder/file.html">Absolute</a></p>',
    );
  });

  it('Renders self links', async () => {
    await assertMd(
      '[Self](./file.md)',
      '<p><a href="./file.html">Self</a></p>',
    );
  });

  it('Renders relative links', async () => {
    await assertMd(
      '[Relative](../folder/file.md)',
      '<p><a href="../folder/file.html">Relative</a></p>',
    );
  });

  it('Renders escaped links', async () => {
    await assertMd(
      '[Escaped](https://example.com/test\\_suite.html?d=wb4c84d46c3bf40b7bf36440744f1ee6f\\&csf=1\\&web=1\\&e=QcIGyX)',
      '<p><a href="https://example.com/test_suite.html?d=wb4c84d46c3bf40b7bf36440744f1ee6f&amp;csf=1&amp;web=1&amp;e=QcIGyX">Escaped</a></p>',
    );
  });

  it('Renders anchored relative links', async () => {
    await assertMd(
      '[Relative](./../folder/file.md)',
      '<p><a href="./../folder/file.html">Relative</a></p>',
    );
  });
});
//
