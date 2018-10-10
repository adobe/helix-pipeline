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
const winston = require('winston');
const fs = require('fs-extra');
const path = require('path');
const { pipe } = require('../src/defaults/html.pipe.js');
const dump = require('../src/utils/dump-context.js');

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
  branch: 'master',
};

const secrets = {
  REPO_RAW_ROOT: 'https://raw.githubusercontent.com/',
};

describe('Testing HTML Pipeline', () => {
  it('html.pipe is a function', () => {
    assert.ok(pipe);
    assert.strictEqual(typeof pipe, 'function');
  });

  it('html.pipe does not make HTTP requests if body is provided', async () => {
    const result = await pipe(
      ({ content }) => {
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        assert.equal(content.body, 'Hello World');
        // and return a different status code
        return { response: { status: 201, body: content.html } };
      },
      {
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

    assert.equal(201, result.response.status);
    assert.equal('text/html', result.response.headers['Content-Type']);
    assert.equal('<p>Hello World</p>', result.response.body);
  });

  it('html.pipe makes HTTP requests', async () => {
    const result = await pipe(
      ({ content }) => {
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        assert.ok(content.body);
        assert.ok(content.mdast);
        assert.ok(content.meta);
        assert.ok(content.document);
        assert.equal(typeof content.document.getElementsByTagName, 'function');
        assert.equal(content.document.getElementsByTagName('h1').length, 1);
        assert.equal(content.document.getElementsByTagName('h1')[0].innerHTML, 'Bill, Welcome to the future');
        assert.equal('Medium', content.meta.template);
        assert.equal('Project Helix', content.intro);
        assert.equal('Bill, Welcome to the future', content.title);
        assert.deepEqual(content.sources, ['https://raw.githubusercontent.com/trieloff/soupdemo/master/hello.md']);
        // and return a different status code
        return { response: { status: 201, body: content.html } };
      },
      {
        request: {
          params: {
          },
        },
      },
      {
        request: { params },
        secrets,
        logger,
      },
    );

    const res = result.response;
    assert.equal(201, res.status);
    assert.equal('text/html', res.headers['Content-Type']);
    assert.equal(res.headers['Surrogate-Key'], 'h/WhVujl+n6KANwYWB57fhkvjfzzACeSawAAndzWdK0=');
    assert.equal('<', res.body[0]);
    assert.ok(res.body.match(/srcset/));
  });

  it('html.pipe keeps existing headers', async () => {
    const result = await pipe(
      ({ content }) => ({
        response: {
          status: 201,
          body: content.html,
          headers: {
            'Content-Type': 'text/plain',
            'Surrogate-Key': 'foobar',
          },
        },
      }),
      {},
      {
        request: { params },
        secrets,
        logger,
      },
    );

    assert.equal(201, result.response.status);
    assert.equal('text/plain', result.response.headers['Content-Type']);
    assert.equal(result.response.headers['Surrogate-Key'], 'foobar');
  });

  it('html.pipe produces debug dumps', async () => {
    const result = await pipe(
      ({ content }) => ({
        response: {
          status: 201,
          body: content.html,
          headers: {
            'Content-Type': 'text/plain',
            'Surrogate-Key': 'foobar',
          },
        },
      }),
      {},
      {
        request: { params },
        secrets,
        logger,
      },
    );

    assert.equal(201, result.response.status);
    assert.equal('text/plain', result.response.headers['Content-Type']);
    assert.equal(result.response.headers['Surrogate-Key'], 'foobar');

    const dir = await dump({}, {}, -1);
    const outdir = path.dirname(dir);
    const found = fs.readdirSync(outdir)
      .map(file => path.resolve(outdir, file))
      .map(full => fs.existsSync(full))
      .filter(e => !!e);
    assert.notEqual(found.length, 0);
  });
});
