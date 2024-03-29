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
import assert from 'assert';
import { logging } from '@adobe/helix-testutils';
import { setdefault } from 'ferrum';
import { setupPolly, xmlPipe as pipe } from './utils.js';

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

const params404 = {
  path: '/non_existent_file.md',
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
  XML_PRETTY: false,
};

const expectedXML = '<?xml version="1.0" encoding="utf-8"?><document><title level="1">Bill, Welcome to the future</title></document>';

describe('Testing XML Pipeline', () => {
  let testContext;

  beforeEach(() => {
    testContext = {
      response: {
        body: '<?xml version="1.0" encoding="utf-8"?><test />',
      },
    };
  });

  setupPolly({
    recordIfMissing: false,
  });

  it('xml.pipe is a function', () => {
    assert.ok(pipe);
    assert.strictEqual(typeof pipe, 'function');
  });

  it('xml.pipe makes HTTP requests', async () => {
    const result = await pipe(
      (context) => {
        const cont = context.content;
        // main function
        cont.xml = {
          document: {
            title: {
              '#text': cont.title,
              '@level': 1,
            },
          },
        };
        // assert that pre-processing has happened
        assert.ok(cont.body);
        assert.ok(cont.mdast);
        assert.ok(cont.meta);
        assert.equal(cont.meta.template, 'Medium');
        assert.equal(cont.intro, 'Project Helix');
        assert.equal(cont.title, 'Bill, Welcome to the future');

        // and return a different status code
        setdefault(context, 'response', {}).status = 201;
      },
      {},
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
      },
    );

    assert.equal(result.response.status, 201);
    assert.equal(result.response.headers['Content-Type'], 'application/xml');
    assert.equal(result.response.body, expectedXML);
  });

  it('xml.pipe can be extended', async () => {
    const myfunc = (context) => {
      context.content.xml = {
        document: {
          title: {
            '#text': context.content.title,
            '@level': 1,
          },
        },
      };
    };

    let calledfoo = false;
    let calledbar = false;
    let calledbaz = false;
    function foo() {
      assert.equal(calledfoo, false, 'foo has not yet been called');
      assert.equal(calledbar, false, 'bar has not yet been called');
      calledfoo = true;
    }

    function bar() {
      assert.equal(calledfoo, true, 'foo has been called');
      assert.equal(calledbar, false, 'bar has not yet been called');
      calledbar = true;
    }

    function baz() {
      calledbaz = true;
    }

    function shouttitle(p) {
      const { title } = p.content.xml.document;
      title['#text'] = `${title['#text'].toUpperCase()}!!!`;
      return p;
    }

    myfunc.before = {
      fetch: foo,
      xml: shouttitle,
    };

    myfunc.after = {
      esi: bar,
      // after the metadata has been retrieved, make sure that
      // the title is being shouted
      never: baz,
    };

    const res = await pipe(
      myfunc,
      { },
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
      },
    );

    assert.equal(calledfoo, true, 'foo has been called');
    assert.equal(calledbar, true, 'bar has been called');
    assert.equal(calledbaz, false, 'baz has never been called');

    assert.ok(res.response.body.match(/FUTURE!!!/));
  });

  it('xml.pipe does not overwrite existing response body', async () => {
    const result = await pipe(
      () => {},
      testContext,
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
      },
    );

    assert.equal(result.response.body, testContext.response.body);
  });

  it('xml.pipe uses default logger if none provided', async () => {
    const result = await pipe(
      () => {},
      testContext,
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
      },
    );

    assert.equal(result.response.body, testContext.response.body);
  });

  it('xml.pipe serves 404 for non existent content', async () => {
    const result = await pipe(
      () => {}, // empty main function
      {},
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params: params404,
        },
        secrets,
        logger,
      },
    );

    assert.equal(result.response.status, 404);
  });

  it('xml.pipe detects ESI tag in XML object', async () => {
    const result = await pipe(
      (context) => {
        context.content.xml = {
          root: {
            'esi:include': {
              '@src': 'foo.xml',
              '@xmlns:esi': 'http://www.edge-delivery.org/esi/1.0',
            },
          },
        };
        setdefault(context, 'response', {}).status = 201;
      },
      {},
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
      },
    );
    assert.equal(result.response.status, 201);
    assert.equal(result.response.headers['X-ESI'], 'enabled');
  });
});
