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

/*
copied from
https://github.com/micromark/micromark-extension-gfm/blob/7bc6b6f3baf941f877d7b2111e9257b21b13b37e/index.js

(The MIT License)

Copyright (c) 2020 Titus Wormer <tituswormer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 *
 * @typedef {import('mdast-util-gfm-table').Options} Options
 */

// import {
//   gfmAutolinkLiteralFromMarkdown,
//   gfmAutolinkLiteralToMarkdown
// } from 'mdast-util-gfm-autolink-literal'
import {
  gfmFootnoteFromMarkdown,
  gfmFootnoteToMarkdown,
} from 'mdast-util-gfm-footnote';
import {
  gfmStrikethroughFromMarkdown,
  gfmStrikethroughToMarkdown,
} from 'mdast-util-gfm-strikethrough';
import { gfmTableFromMarkdown, gfmTableToMarkdown } from 'mdast-util-gfm-table';
import {
  gfmTaskListItemFromMarkdown,
  gfmTaskListItemToMarkdown,
} from 'mdast-util-gfm-task-list-item';

/**
 * @returns {Array.<FromMarkdownExtension>}
 */
export function gfmFromMarkdown() {
  return [
    gfmFootnoteFromMarkdown(),
    gfmStrikethroughFromMarkdown,
    gfmTableFromMarkdown,
    // gfmAutolinkLiteralFromMarkdown,
    gfmTaskListItemFromMarkdown,
  ];
}

/**
 * @param {Options} [options]
 * @returns {ToMarkdownExtension}
 */
export function gfmToMarkdown(options) {
  return {
    extensions: [
      // gfmAutolinkLiteralToMarkdown,
      gfmFootnoteToMarkdown(),
      gfmStrikethroughToMarkdown,
      gfmTableToMarkdown(options),
      gfmTaskListItemToMarkdown,
    ],
  };
}
