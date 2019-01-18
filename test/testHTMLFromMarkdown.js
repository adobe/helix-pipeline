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
const winston = require('winston');
const { JSDOM } = require('jsdom');
const { assertEquivalentNode } = require('@adobe/helix-shared').dom;
const { pipe } = require('../src/defaults/html.pipe.js');

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

const logger = winston.createLogger({
  // tune this for debugging
  level: 'debug',
  // and turn this on if you want the output
  silent: true,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ],
});

/**
 * Assert that a specific html dom is generated from the given markdown
 * using our html pipeline.
 *
 * The comparison between generated html and given html is done on dom
 * level, so differences not affecting the html (like most whitespace)
 * are ignored.
 *
 * This may check multiple categories of template functions; currently
 * the following classes are checked:
 *
 * * Ones rendering content.children
 * * Ones rendering content.html
 *
 * @param {String} md The markdown to convert to html.
 * @param {String} html The html we expect to be generated.
 */
const assertMd = async (md, html) => {
  const fromChildren = ({ content }) => ({ response: { status: 201, body: content.children.join('\n') } });
  const fromHTML = ({ content }) => ({ response: { status: 201, body: content.html } });

  const expected = new JSDOM(html).window.document.body;
  await Promise.all([fromChildren, fromHTML].map(async (fn) => {
    const generated = await pipe(fn, { content: { body: md } }, { logger, request: { params } });
    const actual = new JSDOM(generated.response.body).window.document.body;
    assertEquivalentNode(actual, expected);
  }));
};

/**
 * Test a specific markdown feature.
 *
 * This is just a wrapper calling it and then issuing a single
 * assertMd.
 *
 * @param {String} desc The description passed to it.
 * @param {String} md The markdown passed to the pipeline.
 * @param {String} html The html that is expected to be generated.
 */
const itMd = (desc, md, html) => {
  it(desc, async () => {
    await assertMd(md, html);
  });
};

describe('Testing Markdown conversion', () => {
  itMd('Renders empty markdown', '', '');
  itMd('Renders single paragraph', // Regression #157
    'Hello World.',
    '<p>Hello World.</p>');
});
