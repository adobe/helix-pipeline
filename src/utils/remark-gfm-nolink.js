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
/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 * @typedef {import('micromark-extension-gfm-strikethrough').Options} Options
 * @typedef {import('micromark-extension-gfm-footnote').HtmlOptions} HtmlOptions
 */

import {
  combineExtensions,
  combineHtmlExtensions,
} from 'micromark-util-combine-extensions';
// import {
//   gfmAutolinkLiteral,
//   gfmAutolinkLiteralHtml
// } from 'micromark-extension-gfm-autolink-literal'
import { gfmFootnote, gfmFootnoteHtml } from 'micromark-extension-gfm-footnote';
import {
  gfmStrikethrough,
  gfmStrikethroughHtml,
} from 'micromark-extension-gfm-strikethrough';
import { gfmTable, gfmTableHtml } from 'micromark-extension-gfm-table';
import { gfmTagfilterHtml } from 'micromark-extension-gfm-tagfilter';
import {
  gfmTaskListItem,
  gfmTaskListItemHtml,
} from 'micromark-extension-gfm-task-list-item';
import { gfmFromMarkdown, gfmToMarkdown } from './mdast-util-gfm-nolink.js';

/**
 * Support GFM or markdown on github.com.
 *
 * @param {Options} [options]
 * @returns {Extension}
 */
export function gfm(options) {
  return combineExtensions([
    // gfmAutolinkLiteral,
    gfmFootnote(),
    gfmStrikethrough(options),
    gfmTable,
    gfmTaskListItem,
  ]);
}

/**
 * Support to compile GFM to HTML.
 *
 * @param {HtmlOptions} [options]
 * @returns {HtmlExtension}
 */
export function gfmHtml(options) {
  return combineHtmlExtensions([
    // gfmAutolinkLiteralHtml,
    gfmFootnoteHtml(options),
    gfmStrikethroughHtml,
    gfmTableHtml,
    gfmTagfilterHtml,
    gfmTaskListItemHtml,
  ]);
}

/**
 * Plugin to support GFM (autolink literals, footnotes, strikethrough, tables, tasklists).
 *
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
export default function remarkGfm(options = {}) {
  const data = this.data();

  /**
   * @param {string} field
   * @param {unknown} value
   */
  function add(field, value) {
    const list = /** @type {unknown[]} */ (
      // Other extensions
      /* c8 ignore next 2 */
      data[field] ? data[field] : (data[field] = [])
    );

    list.push(value);
  }

  add('micromarkExtensions', gfm(options));
  add('fromMarkdownExtensions', gfmFromMarkdown());
  add('toMarkdownExtensions', gfmToMarkdown(options));
}
