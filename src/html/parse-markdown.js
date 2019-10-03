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
const { setdefault } = require('ferrum');
const VDOMTransformer = require('../utils/mdast-to-vdom');

function parseMarkdown(context, action) {
  const content = setdefault(context, 'content', {});
  const body = setdefault(content, 'body', '');

  const request = setdefault(context, 'request', {});
  if (!request.extension) request.extension = 'html';
  const { extension } = request;

  action.logger.debug(`Parsing markdown from request body starting with ${body.split('\n')[0]}`);
  content.mdast = unified().use(remark).parse(body);
  // initialize transformer
  action.transformer = new VDOMTransformer()
    .withOptions({ extension, ...action.secrets });
}

module.exports = parseMarkdown;
