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
import { visit } from 'unist-util-visit';
import { setdefault } from 'ferrum';
import { selectstrain, testgroups, pick } from '../src/html/conditional-sections.js';
import { pipe, setupPolly } from './utils.js';

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

// return only sections that are not hidden
const nonhidden = (section) => !section.meta.hidden;

describe('Integration Test Section Strain Filtering', () => {
  setupPolly({
    recordIfMissing: false,
  });

  it('html.pipe sees only selected section', async () => {
    const myparams = { strain: 'a', ...params };
    const result = await pipe(
      (context) => {
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        const { content } = context;
        logger.debug(`Found ${content.mdast.children.filter(nonhidden).length} nonhidden sections`);
        assert.equal(content.mdast.children.filter(nonhidden).length, 3);
        setdefault(context, 'response', {}).body = content.document.body.innerHTML;
      },
      {
        request: crequest,
        content: {
          body: `---
frontmatter: true
---

This is an easy test.

***

These two sections should always be shown

---
strain: a
---

But this one only in strain "A"

---
strain: b
---

And this one only in strain "B"

`,
        },
      },
      {
        request: { params: myparams },
        secrets,
        logger,
      },
    );
    assert.equal(result.error, null);
  });
});

describe('Unit Test Section Strain Filtering', () => {
  it('Works with empty section lists', () => {
    const context = {
      request: crequest,
      content: {
        mdast: {
          children: [],
        },
      },
    };
    const action = {
      logger,
      request: {
        params: {
          strain: 'empty',
        },
      },
    };
    selectstrain(context, action);
  });

  it('Filters sections based on strain', () => {
    const context = {
      content: {
        mdast: {
          children: [
            { meta: { strain: 'test' } },
            { meta: { strain: 'test' } },
            { meta: { strain: 'no-test' } },
          ],
        },
      },
    };
    const action = {
      request: {
        params: {
          strain: 'test',
        },
      },
      logger,
    };
    selectstrain(context, action);
    assert.equal(context.content.mdast.children.filter(nonhidden).length, 2);
  });

  it('Filters sections based on strain (array)', () => {
    const context = {
      content: {
        mdast: {
          children: [
            { meta: { strain: 'test' } },
            { meta: { strain: ['test', 'no-test'] } },
            { meta: { strain: 'no-test' } },
          ],
        },
      },
    };
    const action = {
      request: {
        params: {
          strain: 'test',
        },
      },
      logger,
    };
    selectstrain(context, action);
    assert.equal(context.content.mdast.children.filter(nonhidden).length, 2);
  });

  it('Keeps sections without a strain', () => {
    const context = {
      content: {
        mdast: {
          children: [
            { meta: { strain: 'test' } },
            { meta: { strain: ['test', 'no-test'] } },
            { meta: {} },
          ],
        },
      },
    };
    const action = {
      request: {
        params: {
          strain: 'no-test',
        },
      },
      logger,
    };
    selectstrain(context, action);
    assert.equal(context.content.mdast.children.filter(nonhidden).length, 2);
  });

  it('Keeps sections without metadata', () => {
    const context = {
      content: {
        mdast: {
          children: [
            { meta: { strain: 'test' } },
            { meta: { strain: ['test', 'no-test'] } },
            {},
          ],
        },
      },
    };
    const action = {
      request: {
        params: {
          strain: 'no-test',
        },
      },
      logger,
    };
    selectstrain(context, action);
    assert.equal(context.content.mdast.children.filter(nonhidden).length, 2);
  });

  it('Filters strain a', () => {
    const context = {
      content: {
        mdast: {
          children: [{
            type: 'root',
            children: [],
            title: 'This is an easy test.',
            types: ['has-paragraph', 'has-only-paragraph'],
            intro: 'This is an easy test.',
            meta: { frontmatter: true },
          },
          {
            type: 'root',
            children: [],
            title: 'These two sections should always be shown',
            types: ['has-paragraph', 'has-only-paragraph'],
            intro: 'These two sections should always be shown',
            meta: {},
          },
          {
            type: 'root',
            children: [],
            title: 'But this one only in strain “A”',
            types: ['has-paragraph', 'has-only-paragraph'],
            intro: 'But this one only in strain “A”',
            meta: { strain: 'a' },
          },
          {
            type: 'root',
            children: [],
            title: 'And this one only in strain “B”',
            types: ['has-paragraph', 'has-only-paragraph'],
            intro: 'And this one only in strain “B”',
            meta: { strain: 'b' },
          }],
        },
      },
    };
    const action = {
      request: {
        params: {
          strain: 'a',
        },
      },
      logger,
    };
    selectstrain(context, action);
    assert.equal(context.content.mdast.children.filter(nonhidden).length, 3);
    assert.equal(context.content.mdast.children.filter(nonhidden)[0].meta.hidden, false);
  });
});

describe('Select Sections for Testing #unit', () => {
  it('Works with empty section lists', () => {
    assert.deepEqual(testgroups(), {});
  });

  it('Works with single test variants', () => {
    assert.deepEqual(Object.keys(testgroups([
      { meta: { test: 'a', title: 'a' } },
      { meta: { test: 'a', title: 'b' } },
      {},
    ])), ['a']);
  });

  it('Works with multiple test variants', () => {
    assert.deepEqual(Object.keys(testgroups([
      { meta: { test: 'a', title: 'a' } },
      { meta: { test: 'a', title: 'b' } },
      { meta: { test: 'b', title: 'A' } },
      { meta: { test: 'b', title: 'A' } },
      {},
    ])), ['a', 'b']);
  });
});

describe('Pick among possible candidate sections #unit', () => {
  it('Works with empty candidate lists', () => {
    assert.deepEqual(pick(), {});
  });

  it('Picks a candidate for each group', () => {
    assert.deepEqual(pick({
      a: [1, 2, 3],
      b: [4, 5, 6],
    }), { a: 2, b: 5 });
  });

  it('Picks a different candidate for each strain', () => {
    assert.notDeepEqual(pick({
      a: [1, 2, 3],
      b: [4, 5, 6],
    }, 'zap'), pick({
      a: [1, 2, 3],
      b: [4, 5, 6],
    }, 'zip'));
  });
});

describe('Integration Test A/B Testing', () => {
  setupPolly({
    recordIfMissing: false,
  });

  it('html.pipe sees only one variant', async () => {
    const myparams = { strain: 'default', ...params };
    const result = await pipe(
      (context) => {
        const { content } = context;
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        logger.debug(`Found ${content.mdast.children.filter(nonhidden).length} nonhidden sections`);
        assert.equal(content.mdast.children.filter(nonhidden).length, 3);
        assert.equal(content.mdast.children.filter(nonhidden)[2].meta.test, 'a');
        setdefault(context, 'response', {}).body = content.document.body.innerHTML;
      },
      {
        request: crequest,
        content: {
          body: `---
frontmatter: true
---

This is an easy test.

***

These two sections should always be shown

---
test: a
---

But neither this one.

---
test: a
---

Or this one at the same time.

`,
        },
      },
      {
        request: { params: myparams },
        secrets,
        logger,
      },
    );
    assert.equal(result.error, null);
  });

  it('variant in html.pipe differs from strain to strain', async () => {
    async function runpipe(strain) {
      let selected = {};

      const once = (context) => {
        const { content } = context;
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        logger.debug(`Found ${content.mdast.children.filter(nonhidden).length} nonhidden sections`);
        assert.equal(content.mdast.children.filter(nonhidden).length, 3);
        // remember what was selected
        /* eslint-disable-next-line prefer-destructuring */
        selected = content.mdast.children.filter(nonhidden)[2];
        setdefault(context, 'response', {}).body = content.document.body.innerHTML;
      };

      // this is a bit a 'hack' to make the mdast independent if positions are enabled or not
      // in order to make the A/B test hash most stable.
      once.after = {
        parse({ content: { mdast } }) {
          visit(mdast, (node) => {
            delete node.position;
          });
        },
      };

      const myparams = { strain, ...params };
      const result = await pipe(
        once,
        {
          request: crequest,
          content: {
            body: `---
frontmatter: true
---

This is an easy test.

***

These two sections should always be shown

---
test: a
---

But neither this one.

---
test: a
---

Or that one at the same time, because they are both part of an A/B test.

`,
          },
        },
        {
          request: { params: myparams },
          secrets,
          logger,
        },
      );
      assert.equal(result.error, null);
      return selected;
    }

    // The terms/strains below *happen* to work. They *happen* to produce
    // different hash values for the current section format and content above.
    // If this test fails – especially if you changed anything about the section
    // format, section metadata, the mdast format or the input above, you probably
    // want to change one of these values until you find one that *happens* to work
    // again...
    assert.notDeepEqual(await runpipe('foo'), await runpipe('qux'));
    assert.deepEqual(await runpipe('baz'), await runpipe('baz'));
  });
});
