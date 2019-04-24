/*
 * Copyright 2019 Adobe. All rights reserved.
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
const { Logger } = require('@adobe/helix-shared');
const rewrite = require('../src/html/static-asset-links');
const { pipe } = require('../src/defaults/html.pipe.js');


const logger = Logger.getTestLogger({
  // tune this for debugging
  level: 'info',
});

function rw(content) {
  return rewrite({
    response: {
      body: content,
      headers: {
        'Content-Type': 'text/html',
      },
    },
  }).response.body;
}

describe('Integration Test Static Asset Rewriting', () => {
  let production;

  before('Fake Production Mode', () => {
    // eslint-disable-next-line no-underscore-dangle
    production = process.env.__OW_ACTIVATION_ID;
    // eslint-disable-next-line no-underscore-dangle
    process.env.__OW_ACTIVATION_ID = 'fake';
  });

  it('Test static asset rewriting in full pipeline', async () => {
    const context = {
      content: {
        body: 'Hello World',
      },
    };
    const action = {
      request: {
        params: {},
      },
      logger,
    };
    const once = ({ content }) => ({
      response: {
        status: 200,
        body: `<html>
  <head>
    <title>${content.document.body.textContent}</title>
    <script src="index.js"></script>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    ${content.document.body.innerHTML}
    <script>
      alert('ok');
    </script>
  </body>
</html>`,
      },
    });

    const res = await pipe(once, context, action);

    assert.equal(res.response.body, `<html><head>
    <title>Hello World</title>
    <script src='<esi:include src="index.js.esi"/><esi:remove>index.js</esi:remove>'></script>
    <link rel="stylesheet" href='<esi:include src="style.css.esi"/><esi:remove>style.css</esi:remove>'>
  </head>
  <body>
    <p>Hello World</p>
    <script>
      alert('ok');
    </script>
  
</body></html>`);
  });

  after('Reset Production Mode', () => {
    // eslint-disable-next-line no-underscore-dangle
    process.env.__OW_ACTIVATION_ID = production;
  });
});

describe('Test Static Asset Rewriting', () => {
  it('Ignores non-HTML', () => {
    assert.deepEqual(rewrite({
      response: {
        body: '{}',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    }), {});
  });

  it('Load simple HTML', async () => {
    assert.equal(rw(`<!doctype html><html><head>
    <title>Normal</title>
  </head>
  <body>Just normal things
</body></html>`), `<!doctype html><html><head>
    <title>Normal</title>
  </head>
  <body>Just normal things
</body></html>`);
  });

  it('ESI include script tags HTML', async () => {
    assert.equal(rw(`<!doctype html><html><head>
    <title>Normal</title>
    <script src="test.js"></script>
    <script src="keep.js?cached=false"></script>
    <script src="//code.jquery.com/jquery-3.4.0.min.js"></script>
  </head>
  <body>Just normal things
</body></html>`), `<!doctype html><html><head>
    <title>Normal</title>
    <script src='<esi:include src="test.js.esi"/><esi:remove>test.js</esi:remove>'></script>
    <script src="keep.js?cached=false"></script>
    <script src="//code.jquery.com/jquery-3.4.0.min.js"></script>
  </head>
  <body>Just normal things
</body></html>`);
  });

  it('ESI include link tags HTML', async () => {
    assert.equal(rw(`<!doctype html><html><head>
    <title>Normal</title>
    <link rel="stylesheet foo" href="test.css">
    <link rel="stylesheet" href="keep.css?cached=false">
    <link rel="stylesheet" href="//code.jquery.com/jquery-3.4.0.min.css">
  </head>
  <body>Just normal things
</body></html>`), `<!doctype html><html><head>
    <title>Normal</title>
    <link rel="stylesheet foo" href='<esi:include src="test.css.esi"/><esi:remove>test.css</esi:remove>'>
    <link rel="stylesheet" href="keep.css?cached=false">
    <link rel="stylesheet" href="//code.jquery.com/jquery-3.4.0.min.css">
  </head>
  <body>Just normal things
</body></html>`);
  });
});
