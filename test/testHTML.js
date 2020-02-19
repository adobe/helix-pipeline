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
const { JSDOM } = require('jsdom');
const fs = require('fs-extra');
const path = require('path');
const { runPipeline } = require('../src/utils/openwhisk.js');
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
};


const crequest = {
  extension: 'html',
  url: '/test/test.html',
};

describe('Testing HTML Pipeline', () => {
  setupPolly({
    recordIfMissing: false,
  });

  it('html.pipe is a function', () => {
    assert.ok(pipe);
    assert.strictEqual(typeof pipe, 'function');
  });

  it('html.pipe does not make HTTP requests if body is provided', async () => {
    const result = await pipe(
      (context) => {
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        assert.equal(context.content.body, 'Hello World');
        // and return a different status code
        context.response = { status: 201, body: context.content.document.body.innerHTML };
      },
      {
        request: crequest,
        content: {
          body: 'Hello World',
        },
      },
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
    assert.equal(result.response.headers['Content-Type'], 'text/html');
    assert.equal(result.response.headers['X-ESI'], undefined);
    assert.equal(result.response.body, '<p>Hello World</p>');
  });

  it('html.pipe keeps proper ESI tags', async () => {
    const result = await pipe(
      (context) => {
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        assert.equal(context.content.body, 'Hello World');
        // and return a different status code
        context.response = {
          status: 201,
          body: `<html>
<head><title>ESI-Test</title><head>
<body>
<div>
<esi:include src="foo.html"></esi:include>
</div>
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
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
      },
    );
    assert.equal(result.response.body, `<html><head><title>ESI-Test</title>
</head><body>
<div>
<esi:include src="foo.html"></esi:include>
</div>

</body></html>`);
  });

  it('html.pipe keeps self-closing ESI tags', async () => {
    const result = await pipe(
      (context) => {
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        assert.equal(context.content.body, 'Hello World');
        // and return a different status code
        context.response = {
          status: 201,
          body: `<html>
<head><title>ESI-Test</title><head>
<body>
<div>
<esi:include src="foo.html" />
</div>
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
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
      },
    );
    assert.equal(result.response.body, `<html><head><title>ESI-Test</title>
</head><body>
<div>
<esi:include src="foo.html">
</esi:include></div>

</body></html>`);
  });


  it('html.pipe keeps double ESI tags', async () => {
    const result = await pipe(
      (context) => {
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        assert.equal(context.content.body, 'Hello World');
        // and return a different status code
        context.response = {
          status: 201,
          body: `<html>
<head><title>ESI-Test</title><head>
<body>
<div>
<esi:include src="foo.html"></esi:include>
<esi:include src="bar.html"></esi:include>
</div>
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
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
      },
    );
    assert.equal(result.response.body, `<html><head><title>ESI-Test</title>
</head><body>
<div>
<esi:include src="foo.html"></esi:include>
<esi:include src="bar.html"></esi:include>
</div>

</body></html>`);
  });

  it('html.pipe can be extended', async () => {
    const myfunc = (context) => {
      context.response = {
        body: `<h1>${context.content.title}</h1>
${context.content.document.body.innerHTML}`,
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
      p.content.title = `${p.content.title.toUpperCase()}!!!`;
    }

    myfunc.before = {
      fetch: foo,
    };

    myfunc.after = {
      esi: bar,
      // after the metadata has been retrived, make sure that
      // the title is being shouted
      meta: shouttitle,
      never: baz,
    };

    const res = await pipe(
      myfunc,
      {
        request: crequest,
        content: {
          body: 'Hello World',
        },
      },
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

    assert.ok(res.response.body.match(/HELLO WORLD/));
  });

  it('html.pipe renders index.md from helix-cli correctly', async () => {
    const result = await pipe(
      (context) => {
        const { content } = context;
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        assert.equal(content.title, 'Helix - {{project.name}}');
        assert.equal(content.image, './helix_logo.png');
        assert.equal(content.intro, 'It works! {{project.name}} is up and running.');
        // and return a different status code
        context.response = { status: 201, body: content.document.body.innerHTML };
      },
      {
        request: crequest,
        content: {
          body: fs.readFileSync(path.resolve(__dirname, 'fixtures/index-unmodified.md')).toString(),
        },
      },
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
      },
    );
    assert.equal(result.error, undefined);
    assert.notEqual(result.response.status, 500);
  });

  it('html.pipe renders index.md from project-helix.io correctly', async () => {
    const result = await pipe(
      (context) => {
        const { content } = context;
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        assert.equal(content.title, 'Welcome to Project Helix');
        assert.equal(content.image, 'assets/browser.png');
        assert.equal(content.intro, 'Helix is the new experience management service to create, manage, and deliver great digital experiences.');
        // and return a different status code
        context.response = { status: 201, body: content.document.body.innerHTML };
      },
      {
        request: crequest,
        content: {
          body: fs.readFileSync(path.resolve(__dirname, 'fixtures/index-projecthelixio.md')).toString(),
        },
      },
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
      },
    );
    assert.equal(result.error, undefined);
    assert.notEqual(500, result.response.status);
  });

  it('html.pipe renders modified index.md from helix-cli correctly', async () => {
    const result = await pipe(
      (context) => {
        const { content } = context;
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        assert.equal(content.title, 'Helix - {{project.name}}');
        assert.equal(content.image, undefined);
        assert.equal(content.intro, 'It works! {{project.name}} is up and running.');
        // and return a different status code
        context.response = { status: 201, body: content.document.body.innerHTML };
      },
      {
        request: crequest,
        content: {
          body: fs.readFileSync(path.resolve(__dirname, 'fixtures/index-modified.md')).toString(),
        },
      },
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
      },
    );
    assert.equal(result.error, undefined);
    assert.notEqual(500, result.response.status);
  });

  it('html.pipe complains when context is invalid', async () => {
    const result = await pipe(
      (context) => {
        context.response = { status: 201, body: context.content.document.body.innerHTML };
      },
      {
        request: crequest,
        content: {
          foo: 'Hello World',
        },
      },
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
      },
    );
    assert.ok(result.error);
    assert(result.error.stack.includes('Error: Invalid Context'));
    assert(result.error.stack.includes('additionalProperties should NOT have additional properties'));
  });

  it('html.pipe complains with a specific message for mdast nodes when context is invalid', async () => {
    const result = await pipe(
      ({ content }) => ({ response: { status: 201, body: content.document.body.innerHTML } }),
      {
        request: crequest,
        content: {
          mdast: {
            type: 'notroot',
          },
        },
      },
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
      },
    );
    assert.ok(result.error);
    assert(result.error.stack.includes('Error: Invalid Context'));
    assert(result.error.stack.includes('should be equal to one of the allowed values'));
  });

  it('html.pipe complains with a specific message for mdast nodes wih extra properties when context is invalid', async () => {
    const result = await pipe(
      (context) => {
        context.response = { status: 201, body: context.content.document.body.innerHTML };
      }, {
        request: crequest,
        content: {
          mdast: {
            children: [{ type: 'root', custom: 'notallowed' }],
          },
        },
      },
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
      },
    );
    assert.ok(result.error);
    assert(result.error.stack.includes('Error: Invalid Context'));
    assert(result.error.stack.includes('additionalProperties should NOT have additional properties'));
  });

  it('html.pipe complains when action is invalid', async () => {
    const result = await pipe(
      (context) => {
        context.response = { status: 201, body: context.content.document.body.innerHTML };
      }, {
        request: crequest,
        content: {
          body: 'Hello World',
        },
      },
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
        break: true,
      },
    );
    assert.ok(result.error);
    assert(result.error.stack.includes('Error: Invalid Action'));
    assert(result.error.stack.includes('additionalProperties should NOT have additional properties'));
  });

  it('html.pipe makes HTTP requests', async () => {
    const result = await pipe(
      (context) => {
        const { content } = context;
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        assert.ok(content.body);
        assert.ok(content.mdast);
        assert.ok(content.meta);
        assert.ok(content.document);
        assert.equal(typeof content.document.getElementsByTagName, 'function');
        assert.equal(content.document.getElementsByTagName('h1').length, 1);
        assert.equal(content.document.getElementsByTagName('h1')[0].innerHTML, 'Bill, Welcome to the future');
        assert.equal(content.meta.template, 'Medium');
        assert.equal(content.intro, 'Project Helix');
        assert.equal(content.title, 'Bill, Welcome to the future');
        assert.deepEqual(content.sources, ['https://raw.githubusercontent.com/trieloff/soupdemo/master/hello.md']);
        // and return a different status code
        context.response = { status: 201, body: content.document.body.innerHTML };
      },
      {
        request: {
          params: {
          },
        },
      },
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets,
        logger,
      },
    );

    const res = result.response;
    assert.equal(res.status, 201);
    assert.equal(res.headers['Content-Type'], 'text/html');
    assert.equal(res.headers['Cache-Control'], 's-maxage=2592000, stale-while-revalidate=31536000');
    assert.equal(res.headers['Surrogate-Key'], 'yt+7rF5AO4Kmk0aF');
    assert.equal(res.body[0], '<');
    assert.ok(res.body.match(/<img/));
  });

  it('html.pipe makes HTTP requests and falls back to master', async () => {
    const myparams = { ...params };
    delete myparams.ref;

    const result = await pipe(
      (context) => {
        const { content } = context;
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        assert.ok(content.body);
        assert.ok(content.mdast);
        assert.ok(content.meta);
        assert.ok(content.document);
        assert.equal(typeof content.document.getElementsByTagName, 'function');
        assert.equal(content.document.getElementsByTagName('h1').length, 1);
        assert.equal(content.document.getElementsByTagName('h1')[0].innerHTML, 'Bill, Welcome to the future');
        assert.equal(content.meta.template, 'Medium');
        assert.equal(content.intro, 'Project Helix');
        assert.equal(content.title, 'Bill, Welcome to the future');
        assert.deepEqual(content.sources, ['https://raw.githubusercontent.com/trieloff/soupdemo/master/hello.md']);
        // and return a different status code
        context.response = { status: 201, body: content.document.body.innerHTML };
      },
      {
        request: {
          params: {
          },
        },
      },
      {
        request: {
          params: myparams,
          headers: { 'Cache-Control': 'no-store' },
        },
        secrets,
        logger,
      },
    );

    const res = result.response;
    assert.equal(res.status, 201);
    assert.equal(res.headers['Content-Type'], 'text/html');
    assert.equal(res.headers['Cache-Control'], 's-maxage=2592000, stale-while-revalidate=31536000');
    assert.equal(res.headers['Surrogate-Key'], 'yt+7rF5AO4Kmk0aF');
    assert.equal(res.body[0], '<');
    assert.ok(res.body.match(/<img/));
  });

  it('html.pipe makes HTTP requests and prefers branch param for surrogate computationr', async () => {
    const myparams = { ...params };
    myparams.branch = 'mybranch';

    const result = await pipe(
      (context) => {
        const { content } = context;
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        assert.ok(content.body);
        assert.ok(content.mdast);
        assert.ok(content.meta);
        assert.ok(content.document);
        assert.equal(typeof content.document.getElementsByTagName, 'function');
        assert.equal(content.document.getElementsByTagName('h1').length, 1);
        assert.equal(content.document.getElementsByTagName('h1')[0].innerHTML, 'Bill, Welcome to the future');
        assert.equal(content.meta.template, 'Medium');
        assert.equal(content.intro, 'Project Helix');
        assert.equal(content.title, 'Bill, Welcome to the future');
        assert.deepEqual(content.sources, ['https://raw.githubusercontent.com/trieloff/soupdemo/mybranch/hello.md']);
        // and return a different status code
        context.response = { status: 201, body: content.document.body.innerHTML };
      },
      {
        request: {
          params: {
          },
        },
      },
      {
        request: {
          params: myparams,
          headers: { 'Cache-Control': 'no-store' },
        },
        secrets,
        logger,
      },
    );

    const res = result.response;
    assert.equal(res.status, 201);
    assert.equal(res.headers['Content-Type'], 'text/html');
    assert.equal(res.headers['Cache-Control'], 's-maxage=2592000, stale-while-revalidate=31536000');
    assert.equal(res.headers['Surrogate-Key'], '+XCHRiDHBAUBviSX');
    assert.equal(res.body[0], '<');
    assert.ok(res.body.match(/<img/));
  });

  it('html.pipe serves 404 for non existent content', async () => {
    const result = await pipe(
      // this is the main function (normally it would be the template function)
      () => ({ response: { body: '<html></html>' } }),
      {
        request: {
          params: {
          },
        },
      },
      {
        request: {
          params: params404,
          headers: { 'Cache-Control': 'no-store' },
        },
        secrets,
        logger,
      },
    );

    const res = result.response;
    assert.deepEqual(res, {
      headers: {},
      status: 404,
    });
  });

  it('html.pipe via pipeline fetch errors are propagated to action response', async () => {
    const out = await runPipeline((context) => {
      context.response = {
        document: context.content.document,
      };
    }, pipe, {
      owner: 'adobe',
      repo: 'helix-pipeline',
      ref: 'master',
      path: 'not-existent.md',
    });
    assert.ok(out.errorStack.startsWith('Error: Error while fetching file from https://raw.githubusercontent.com/adobe/helix-pipeline/master/not-existent.md: 404'));
    delete out.errorStack;
    assert.deepEqual(out, {
      body: '',
      errorMessage: 'Error: Error while fetching file from https://raw.githubusercontent.com/adobe/helix-pipeline/master/not-existent.md: 404',
      headers: {},
      statusCode: 404,
    });
  });

  it('html.pipe keeps existing headers', async () => {
    const result = await pipe(
      (context) => {
        context.response = {
          status: 201,
          body: context.content.document.body.innerHTML,
          headers: {
            'Content-Type': 'text/plain',
            'Surrogate-Key': 'foobar',
            'Cache-Control': 'max-age=0',
          },
        };
      },
      { request: crequest },
      {
        request: {
          params,
          headers: { 'Cache-Control': 'no-store' },
        },
        secrets,
        logger,
      },
    );

    assert.equal(result.response.status, 201);
    assert.equal(result.response.headers['Content-Type'], 'text/plain');
    assert.equal(result.response.headers['Cache-Control'], 'max-age=0');
    assert.equal(result.response.headers['Surrogate-Key'], 'foobar');
  });

  it('html.pipe produces debug dumps in memory', async () => {
    const action = {
      request: {
        headers: { 'Cache-Control': 'no-store' },
        params,
      },
      secrets,
      logger,
    };

    const result = await pipe(
      (context) => {
        context.response = {
          status: 201,
          body: context.content.document.body.innerHTML,
          headers: {
            'Content-Type': 'text/plain',
            'Surrogate-Key': 'foobar',
          },
        };
      },
      {
        content: {
          body: '# foo',
        },
        request: crequest,
      },
      action,
    );
    assert.equal(result.response.status, 201);
    assert.equal(result.response.headers['Content-Type'], 'text/plain');
    assert.equal(result.response.headers['Surrogate-Key'], 'foobar');
    assert.ok(action.debug.contextDumps.length > 0);
    assert.equal(action.debug.dumpDir, undefined);
  });

  it('html.pipe produces debug dumps on disk for error', async () => {
    const action = {
      request: {
        headers: { 'Cache-Control': 'no-store' },
        params,
      },
      secrets,
      logger,
    };

    const result = await pipe(
      () => {
        throw Error('boom');
      },
      {
        content: {
          body: '# foo',
        },
        request: crequest,
      },
      action,
    );
    assert.equal(result.response.status, 500);

    const outdir = action.debug.dumpDir;
    const found = fs.readdirSync(outdir)
      .map((file) => path.resolve(outdir, file))
      .map((full) => fs.existsSync(full))
      .filter((e) => !!e);
    // the last step, `report`, is not written to disk.
    assert.equal(found.length + 1, action.debug.contextDumps.length);
  });

  it('html.pipe sanitizes author-generated content, but not developer-generated code', async () => {
    const result = await pipe(
      (context) => {
        context.response = {
          status: 200,
          body: `
            ${context.content.document.body.innerHTML}
            <a href="javascript:alert('XSS')">Baz</a>
          `,
        };
      },
      {
        request: crequest,
        content: {
          body: `
# Foo

[Bar](javascript:alert('XSS'))
          `,
        },
      },
      {
        request: {
          headers: { 'Cache-Control': 'no-store' },
          params,
        },
        secrets: { ...secrets, SANITIZE_DOM: true },
        logger,
      },
    );
    assert.equal(200, result.response.status);
    assertEquivalentNode(
      new JSDOM(result.response.body).window.document.body,
      new JSDOM('<h1 id="foo">Foo</h1><p><a>Bar</a></p><a href="javascript:alert(\'XSS\')">Baz</a>').window.document.body,
    );
  });

  it('html.pipe creates proper esi includes for css and scripts', async () => {
    // emulate production environment
    process.env.__OW_ACTIVATION_ID = '1234';
    try {
      const result = await pipe(
        (context) => {
          context.response = {
            status: 200,
            body: `
              <html>
              <head>
                  <link rel="stylesheet" href="/dist/bootstrap.min.css"/>
                  <script src="/dist/scripts.js"></script>
              </head>
              ${context.content.document.body.outerHTML}
              </html>
            `,
          };
        },
        {
          request: crequest,
          content: {
            body: '# Foo',
          },
        },
        {
          request: {
            headers: { 'Cache-Control': 'no-store' },
            params,
          },
          logger,
        },
      );
      assert.equal(200, result.response.status);
      assertEquivalentNode(
        new JSDOM(result.response.body).window.document,
        new JSDOM(`<html><head>
            <link rel="stylesheet" href="<esi:include src='/dist/bootstrap.min.css.url'/><esi:remove>/dist/bootstrap.min.css</esi:remove>">
            <script src="<esi:include src='/dist/scripts.js.url'/><esi:remove>/dist/scripts.js</esi:remove>"></script>
            </head><body><h1 id="foo">Foo</h1></body></html>`).window.document,
      );
    } finally {
      delete process.env.__OW_ACTIVATION_ID;
    }
  });
});
