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
const unified = require('unified');
const remark = require('remark-parse');
const gfm = require('remark-gfm');
const visit = require('unist-util-visit');
const { setdefault } = require('ferrum');
const { remarkMatter } = require('@adobe/helix-markdown-support');
const { numericLogLevel } = require('@adobe/helix-log');
const VDOMTransformer = require('../utils/mdast-to-vdom');

class FrontmatterParsingError extends Error {
}

function removePositions(tree) {
  visit(tree, (node) => {
    // eslint-disable-next-line no-param-reassign
    delete node.position;
    return visit.CONTINUE;
  });
  return tree;
}

function parseMarkdown(context, action) {
  const { logger } = action;
  const content = setdefault(context, 'content', {});
  const body = setdefault(content, 'body', '');

  const request = setdefault(context, 'request', {});
  if (!request.extension) request.extension = 'html';
  const { extension } = request;

  // convert linebreaks
  const converted = body.replace(/(\r\n|\n|\r)/gm, '\n');
  const idx = Math.min(converted.indexOf('\n'), 100);
  action.logger.debug(`Parsing markdown from request body starting with ${converted.substring(0, idx)}`);

  content.mdast = unified()
    .use(remark)
    .use(gfm)
    .use(remarkMatter, {
      errorHandler: (e) => {
        action.logger.warn(new FrontmatterParsingError(e));
      },
    })
    .parse(converted);

  if (numericLogLevel(logger.level) < numericLogLevel('debug')) {
    removePositions(content.mdast);
  }

  // initialize transformer
  action.transformer = new VDOMTransformer()
    .withOptions({ extension, ...action.secrets });
}

module.exports = parseMarkdown;
module.exports.FrontmatterParsingError = FrontmatterParsingError;
