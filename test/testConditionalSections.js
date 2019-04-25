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
const { Logger } = require('@adobe/helix-shared');
const { pipe } = require('../src/defaults/html.pipe.js');
const { selectstrain, testgroups, pick } = require('../src/utils/conditional-sections');

const logger = Logger.getTestLogger({
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
function nonhidden(section) {
  if (section.meta && section.meta) {
    return !section.meta.hidden;
  }
  return true;
}

describe('Integration Test Section Strain Filtering', () => {
  it('html.pipe sees only selected section', async () => {
    const myparams = Object.assign({ strain: 'a' }, params);
    const result = await pipe(
      ({ content }) => {
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        logger.debug(`Found ${content.sections.filter(nonhidden).length} nonhidden sections`);
        assert.equal(content.sections.filter(nonhidden).length, 3);
        return { response: { body: content.document.body.innerHTML } };
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
        sections: [],
      },
    };
    const action = {
      request: {
        params: {
          strain: 'empty',
        },
      },
    };
    const result = selectstrain(context, action);
    assert.deepStrictEqual(result, {});
  });

  it('Filters sections based on strain', () => {
    const context = {
      content: {
        sections: [
          { meta: { strain: 'test' } },
          { meta: { strain: 'test' } },
          { meta: { strain: 'no-test' } },
        ],
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
    const result = selectstrain(context, action);
    assert.equal(result.content.sections.filter(nonhidden).length, 2);
  });

  it('Filters sections based on strain (array)', () => {
    const context = {
      content: {
        sections: [
          { meta: { strain: 'test' } },
          { meta: { strain: ['test', 'no-test'] } },
          { meta: { strain: 'no-test' } },
        ],
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
    const result = selectstrain(context, action);
    assert.equal(result.content.sections.filter(nonhidden).length, 2);
  });

  it('Keeps sections without a strain', () => {
    const context = {
      content: {
        sections: [
          { meta: { strain: 'test' } },
          { meta: { strain: ['test', 'no-test'] } },
          { meta: {} },
        ],
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
    const result = selectstrain(context, action);
    assert.equal(result.content.sections.filter(nonhidden).length, 2);
  });

  it('Keeps sections without metadata', () => {
    const context = {
      content: {
        sections: [
          { meta: { strain: 'test' } },
          { meta: { strain: ['test', 'no-test'] } },
          {},
        ],
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
    const result = selectstrain(context, action);
    assert.equal(result.content.sections.filter(nonhidden).length, 2);
  });


  it('Filters strain a', () => {
    const context = {
      content: {
        sections: [{
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
    };
    const action = {
      request: {
        params: {
          strain: 'a',
        },
      },
      logger,
    };
    const result = selectstrain(context, action);
    assert.equal(result.content.sections.filter(nonhidden).length, 3);
    assert.deepEqual(result.content.sections.filter(nonhidden)[0], {
      meta: { hidden: false },
    });
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
  it('html.pipe sees only one variant', async () => {
    const myparams = Object.assign({ strain: 'default' }, params);
    const result = await pipe(
      ({ content }) => {
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
        logger.debug(`Found ${content.sections.filter(nonhidden).length} nonhidden sections`);
        assert.equal(content.sections.filter(nonhidden).length, 3);
        assert.equal(content.sections.filter(nonhidden)[2].meta.test, 'a');
        return { response: { body: content.document.body.innerHTML } };
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
      const myparams = Object.assign({ strain }, params);
      const result = await pipe(
        ({ content }) => {
        // this is the main function (normally it would be the template function)
        // but we use it to assert that pre-processing has happened
          logger.debug(`Found ${content.sections.filter(nonhidden).length} nonhidden sections`);
          assert.equal(content.sections.filter(nonhidden).length, 3);
          // remember what was selected
          /* eslint-disable-next-line prefer-destructuring */
          selected = content.sections.filter(nonhidden)[2];
          return { response: { body: content.document.body.innerHTML } };
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
    assert.notDeepEqual(await runpipe('foo'), await runpipe('bang'));
    assert.deepEqual(await runpipe('baz'), await runpipe('baz'));
  });
});
