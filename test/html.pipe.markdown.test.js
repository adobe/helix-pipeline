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
import { logging } from '@adobe/helix-testutils';
import { JSDOM } from 'jsdom';
import { multiline } from '@adobe/helix-shared-string';
import { assertEquivalentNode } from '@adobe/helix-shared-dom';
import { pipe, setupPolly } from './utils.js';

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

describe('Testing Markdown conversion', () => {
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

  it('Renders empty markdown', async () => {
    await assertMd(
      '',
      '',
    );
  });

  it('Renders single paragraph', async () => {
    await assertMd(
      'Hello World.',
      '<p>Hello World.</p>',
    );
  });

  it('Code blocks with lang', async () => {
    await assertMd(
      '```javascript\n```',
      '<pre><code class="language-javascript"></code></pre>',
    );
    await assertMd(
      '```javascript\nconsole.log(42);\n```',
      '<pre><code class="language-javascript">console.log(42);\n</code></pre>',
    );
  });

  it('Code blocks without lang', async () => {
    await assertMd(`
        # Hello

            Hello World
      `, `
        <h1 id="hello">Hello</h1>
        <pre><code>Hello World\n</code></pre>
    `);
    await assertMd(
      '```Hello World```',
      '<p><code>Hello World</code></p>',
    );
    await assertMd(
      '```\nHello World\n```',
      '<pre><code>Hello World\n</code></pre>',
    );
  });

  it('Quote with markdown', async () => {
    await assertMd(`
        # Foo

        bar

        > # Foo
        >
        > bar
      `, `
        <h1 id="foo">Foo</h1>
        <p>bar</p>
        <blockquote>
        <h1 id="foo-1">Foo</h1>
        <p>bar</p>
        </blockquote>
      `);
  });

  it('Link references', async () => {
    await assertMd(`
        Hello [World]
        
        [World]: http://example.com
      `, `
        <p>Hello <a href="http://example.com">World</a></p>
    `);
  });

  it('Admonition Notes', async () => {
    await assertMd(`
          > [!NOTE]
          > This is a note. Who'd have noted?
      `, `
        <blockquote><p>[!NOTE] This is a note. Who’d have noted?</p></blockquote>
    `);
  });

  it('tags', async () => {
    await assertMd(`
          \\<steps>
      `, `
        <p>&lt;steps&gt;</p>
    `);
  });

  it('tags in bold', async () => {
    await assertMd(`
          **\\<form: on24>**
      `, `
        <p><strong>&lt;form: on24&gt;</strong></p>
    `);
  });

  it('Link with angle brackets', async () => {
    await assertMd(`
        # Foo

        Hello World [link](<foobar)
      `, `
        <h1 id="foo">Foo</h1>
        <p>Hello World [link](&lt;foobar)</p>
    `);
  });

  it('Link with space', async () => {
    await assertMd(`
        # Foo

        Hello World [link](foo bar)
      `, `
        <h1 id="foo">Foo</h1>
        <p>Hello World [link](foo bar)</p>
    `);
  });

  it('Link with special character', async () => {
    await assertMd(`
        # Foo

        Hello World [link](λ)
      `, `
        <h1 id="foo">Foo</h1>
        <p>Hello World <a href="%CE%BB">link</a></p>
    `);
  });

  it('HTML Block elements', async () => {
    await assertMd(`
        # Foo

        <form>
          <input type="text" name="fieldName"><label for="fieldName">Name</label>
        </form>
      `, `
        <h1 id="foo">Foo</h1>
        <form><input type="text" name="fieldName"><label for="fieldName">Name</label></form>
    `);
  });

  it('HTML comments', async () => {
    // note that the sanitizer strips out the comments
    await assertMd(`
        # Foo
        <!-- bla -->
      `, `
        <h1 id="foo">Foo</h1>
      `);
  });

  it('HTML inline elements', async () => {
    await assertMd(`
        # Foo <em>Bar</em>

        Hello World [link](λ)
      `, `
        <h1 id="foo-bar">Foo <em>Bar</em></h1>
        <p>Hello World <a href="%CE%BB">link</a></p>
    `);
  });

  it('HTML incomplete inline elements', async () => {
    await assertMd(`
        # Foo Bar</em>
      `, `
        <body><h1 id="foo-bar">Foo Bar</h1></body>
    `);
  });

  it('HTML nested inline elements', async () => {
    await assertMd(`
        # Foo <em>Bar <strong>Important</strong></em>
      `, `
        <h1 id="foo-bar-important">Foo <em>Bar <strong>Important</strong></em></h1>
    `);
  });

  it('HTML nested inline elements and markup', async () => {
    // this is not supported yet. ideally the mdast-to-dom is done directly and not via hast.
    await assertMd(
      '# Foo <em>Bar **Important**</em>',
      '<h1 id="foo-bar-important">Foo <em>Bar <strong>Important</strong></em></h1>',
    );
  });

  it('GFM', async () => {
    await assertMd(`
        Hello World.

        | foo | bar |
        | --- | --- |
        | baz | bim |
      `, `
        <p>Hello World.</p>
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td>bim</td>
            </tr>
          </tbody>
        </table>
      `);
  });

  it('XSS escape href attribute on links disabled by default', async () => {
    await assertMd(`
        [Foo](javascript://%0Dalert('XSS!'))
        [Bar](javascript:alert('XSS!'))
      `, `
        <p>
          <a href="javascript://%0Dalert('XSS!')">Foo</a>
          <a href="javascript:alert('XSS!')">Bar</a>
        </p>
    `);
  });

  it('XSS escape href attribute on links', async () => {
    await assertMd(`
        [Foo](javascript://%0Dalert('XSS!'))
        [Bar](javascript:alert('XSS!'))
      `, `
        <p>
          <a>Foo</a>
          <a>Bar</a>
        </p>
    `, {
      SANITIZE_DOM: true,
    });
  });

  it('XSS escape href in images', async () => {
    await assertMd(`
        ![Foo](javascript://%0Dalert('XSS!'))
        ![Bar](javascript:alert('XSS!'))
      `, `
        <p>
          <img alt="Foo">
          <img alt="Bar">
        </p>
    `, {
      SANITIZE_DOM: true,
    });
  });

  it('XSS escape DOM clobbering attributes', async () => {
    await assertMd(`
        # location
        <a name="anchors">Foo</a>
      `, `
        <h1>location</h1>
        <p><a>Foo</a></p>
    `, {
      SANITIZE_DOM: true,
    });
  });

  it('Accept custom elements and attributes', async () => {
    // note that the remark-parser needs to be reconfigured to support custom block elements:
    // { blocks: [ '.+' ] } or similar. currently, those are treated as inline elements.
    await assertMd(`
        # Foo
        Bar
        <baz-qux corge-grault="garply">Waldo</baz-qux>
      `, `
        <h1 id="foo">Foo</h1>
        <p>Bar <baz-qux corge-grault="garply">Waldo</baz-qux></p>
    `, {
      SANITIZE_DOM: true,
    });
  });

  it('Unwraps hero images in the document root', async () => {
    await assertMd(`
        ![Foo](/bar.png)
      `, `
        <img src="/bar.png" alt="Foo"/>
    `, {
      SANITIZE_DOM: true,
    });
  });

  it('Unwraps hero images in sections', async () => {
    await assertMd(`
        # Foo

        ---

        ![Bar](/baz.png)

      `, `
        <div>
          <h1 id="foo">Foo</h1>
        </div>
        <div>
          <img src="/baz.png" alt="Bar"/>
        </div>
    `, {
      SANITIZE_DOM: true,
    });
  });

  it('Leaves regular images inside paragraphs', async () => {
    await assertMd(`
        # Baz

        ![Foo](/bar.png)
      `, `
        <h1 id="baz">Baz</h1>
        <p>
          <img src="/bar.png" alt="Foo"/>
        </p>
    `, {
      SANITIZE_DOM: true,
    });
  });

  it('Exposes section meta data', async () => {
    await assertMd(`
        ---
        title: foo
        ---

        # Foo

        ---
        baz: qux
        class: qux-section
        ---

        # Baz

        ---
        tagname: section
        ---

        # Corge

        ---
        data-meta: true
        ---

        # Garply

        ---
        data-hlx-types: [fred, plugh]
        ---

        # Fred
      `, `
        <div title="foo">
          <h1 id="foo">Foo</h1>
        </div>
        <div class="qux-section" data-baz="qux">
          <h1 id="baz">Baz</h1>
        </div>
        <section>
          <h1 id="corge">Corge</h1>
        </section>
        <div data-meta>
          <h1 id="garply">Garply</h1>
        </div>
        <div>
          <h1 id="fred">Fred</h1>
        </div>
    `, {
      SANITIZE_DOM: true,
    });
  });

  it('Filters out hlx-* class and data-hlx-* attributes in production', async () => {
    process.env.__OW_ACTIVATION_ID = '1234';
    try {
      await assertMd(`
      ---

      # Foo

      ---
      data-hlx-types: [bar, baz]
      ---

      # Bar
    `, `
      <div>
        <h1 id="foo">Foo</h1>
      </div>
      <div>
        <h1 id="bar">Bar</h1>
      </div>
    `, {
        SANITIZE_DOM: true,
      });
    } finally {
      delete process.env.__OW_ACTIVATION_ID;
    }
  });

  it('is robust against wrong tags in md', async () => {
    await assertMd(
      '# Foo </p>',
      '<h1 id="foo-">Foo</h1>',
    );
  });

  it('is robust against tags in link texts', async () => {
    await assertMd(
      '305-333-2614 [<u>www.mirumagency.com</u>](https://www.mirumagency.com/)',
      '<p>305-333-2614 <a href="https://www.mirumagency.com/"><u>www.mirumagency.com</u></a></p>',
    );
  });

  it('is robust against linebreaks in tags', async () => {
    await assertMd(
      '**<u>  \n</u>**',
      '<p><strong><u><br></u></strong></p>',
    );
  });

  it('translates icons', async () => {
    await assertMd(
      'Hello :photoshop: world.',
      '<p>Hello <img class="icon icon-photoshop" src="/icons/photoshop.svg" alt="photoshop icon">world.</p>',
    );
  });

  it('translates icons in html', async () => {
    await assertMd(
      'Hello <p> test :photoshop:</p> world.',
      '<p>Hello</p><p>test<img class="icon icon-photoshop" src="/icons/photoshop.svg" alt="photoshop icon"></p>world.<p></p>',
    );
  });

  it('translates icons in tables with paras', async () => {
    await assertMd(
      `
            |Video|Text|
            |-|-|
            |youtube|<p>:photoshop: :illustrator:</p></p>|
    `,
      '<table><thead><tr><th>Video</th><th>Text</th></tr></thead><tbody><tr><td>youtube</td><td><p><img class="icon icon-photoshop" src="/icons/photoshop.svg" alt="photoshop icon"><img class="icon icon-illustrator" src="/icons/illustrator.svg" alt="illustrator icon"></p></td></tr></tbody></table>',
    );
  });

  it('translates icons in html tables', async () => {
    await assertMd(
      `
            <table>
                <tr><td class=":noicon:">Video</td><td>Text</td></tr>
                <tr><td>youtube</td><td><p>:photoshop: :illustrator:</p></td></tr>
                <tr><td>:photoshop:</td><td><p>foo :photoshop: bar :illustrator: zoo</p></td></tr>
            </table>
    `,
      `<body>
              <table>
                <tbody>
                  <tr><td class=":noicon:">Video</td><td>Text</td></tr>
                  <tr><td>youtube</td><td><p><img class="icon icon-photoshop" src="/icons/photoshop.svg" alt="photoshop icon"><img class="icon icon-illustrator" src="/icons/illustrator.svg" alt="illustrator icon"></p></td></tr>
                  <tr><td><img class="icon icon-photoshop" src="/icons/photoshop.svg" alt="photoshop icon"></td><td><p>foo <img class="icon icon-photoshop" src="/icons/photoshop.svg" alt="photoshop icon">bar <img class="icon icon-illustrator" src="/icons/illustrator.svg" alt="illustrator icon">zoo</p></td></tr>
                </tbody>
              </table>
            </body>`,
    );
  });

  it('translates svg-icons in html', async () => {
    await assertMd(
      `
            <p>Some SVG :#photoshop-icon:.</p>
    `,
      '<body><p>Some SVG <svg class="icon icon-photoshop-icon"><use href="/icons.svg#photoshop-icon"></use></svg>.</p></body>',
    );
  });

  it('translates html in tables with autolink (disabled)', async () => {
    await assertMd(
      `
            |Links|
            |-----|
            |<p><a href="https://www.adobe.com">https://www.adobe.com</a></p>|
    `,
      '<body><table><thead><tr><th>Links</th></tr></thead><tbody><tr><td><p><a href="https://www.adobe.com">https://www.adobe.com</a></p></td></tr></tbody></table></body>',
    );
  });

  it('expands gfm autolink', async () => {
    await assertMd(
      `
      # Hello
      
      https://www.adobe.com
      
      https\\://www\\.adobe.com
      
    `,
      '<body><h1 id="hello">Hello</h1><p>https://www.adobe.com</p><p>https://www.adobe.com</p></body>',
    );
  });

  it('ignores escaped urls', async () => {
    await assertMd(
      `
          ## test

          /media/oembed?url=https%3A//www\\.youtube.com/watch%3Fv%3D-KYbAk4_wMs&amp;max_width=0&amp;max_height=0&amp;hash=Av_FuBMg_KEg93Yy_XTE1Q4RUzMrFXcMuNH-wNZuBSQ

    `,
      '<h2 id="test">test</h2><p>/media/oembed?url=https%3A//www.youtube.com/watch%3Fv%3D-KYbAk4_wMs&amp;max_width=0&amp;max_height=0&amp;hash=Av_FuBMg_KEg93Yy_XTE1Q4RUzMrFXcMuNH-wNZuBSQ</p>',
    );
  });
});
