/*
 * Copyright 2021 Adobe. All rights reserved.
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
import stringify from 'remark-stringify';
import { unified } from 'unified';
import gfm from 'remark-gfm';
import {
  html, link, paragraph, root, text, table, tableRow, tableCell,
} from 'mdast-builder';
import autolink from '../src/utils/mdast-gfm-autolinks.js';

function assertMD(mdast, md) {
  const actual = unified()
    .use(gfm)
    .use(stringify, {
      strong: '*',
      emphasis: '_',
      bullet: '-',
      fence: '`',
      fences: true,
      incrementListMarker: true,
      rule: '-',
      ruleRepetition: 3,
      ruleSpaces: false,
    }).stringify(mdast);
  assert.strictEqual(actual, md);
}

describe('GFM autolink tests', () => {
  it('keeps structure', async () => {
    const mdast = root([
      paragraph([
        text('Hello. this is a test.'),
      ]),
    ]);
    autolink(mdast);
    assertMD(mdast, 'Hello. this is a test.\n');
  });

  it('ignores www with no schema', async () => {
    const mdast = root([
      paragraph([
        text('http%3a//www.adobe.com'),
        text('https://www.adobe.com'),
      ]),
    ]);
    autolink(mdast);
    assertMD(mdast, 'http%3a//www\\.adobe.com<https://www.adobe.com>\n');
  });

  it('replaces single link', async () => {
    const mdast = root([
      paragraph([
        text('www.adobe.com'),
      ]),
    ]);
    autolink(mdast);
    assertMD(mdast, '[www.adobe.com](www.adobe.com)\n');
  });

  it('handle email addresses', async () => {
    const mdast = root([
      paragraph([
        text('reach me at helix@adobe.com'),
      ]),
    ]);
    autolink(mdast);
    assertMD(mdast, 'reach me at <helix@adobe.com>\n');
  });

  it('do not replace links in html', async () => {
    const mdast = root([
      paragraph([
        html('<a href="www.adobe.com">'),
        text('www.adobe.com'),
        html('</a>'),
      ]),
    ]);
    autolink(mdast);
    assertMD(mdast, '<a href="www.adobe.com">www\\.adobe.com</a>\n');
  });

  it('replace links in tables', async () => {
    const mdast = root([
      table(undefined, [
        tableRow([
          tableCell(text('Product')),
          tableCell(text('Homepage')),
        ]),
        tableRow([
          tableCell(text('helix')),
          tableCell(text('www.hlx.live')),
        ]),
      ]),
    ]);
    autolink(mdast);
    assertMD(mdast, '| Product | Homepage                     |\n'
      + '| ------- | ---------------------------- |\n'
      + '| helix   | [www.hlx.live](www.hlx.live) |\n');
  });

  it('do not replace links in tables with html', async () => {
    const mdast = root([
      table(undefined, [
        tableRow([
          tableCell(text('Product')),
          tableCell(text('Homepage')),
        ]),
        tableRow([
          tableCell(text('helix')),
          tableCell([
            html('<img src="/icon.png"><p><a href="www.hlx.live">'),
            text('www.hlx.live'),
            html('</a></p>'),
          ]),
        ]),
      ]),
    ]);
    autolink(mdast);
    assertMD(mdast, ''
      + '| Product | Homepage                                                             |\n'
      + '| ------- | -------------------------------------------------------------------- |\n'
      + '| helix   | <img src="/icon.png"><p><a href="www.hlx.live">www\\.hlx.live</a></p> |\n');
  });

  it('creates several links', async () => {
    const mdast = root([
      paragraph([
        text('For questions ask mailto:dev@hlx.live, or visit https://www.hlx.live'),
      ]),
    ]);
    autolink(mdast);
    assertMD(mdast, 'For questions ask <mailto:dev@hlx.live>, or visit <https://www.hlx.live>\n');
  });

  it('does not replace text in links', async () => {
    const mdast = root([
      paragraph([
        link('www.adobe.com', '', [
          text('www.adobe.com'),
        ]),
      ]),
    ]);
    autolink(mdast);
    assertMD(mdast, '[www.adobe.com](www.adobe.com)\n');
  });
});
