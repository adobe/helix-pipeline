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
const retext = require('retext');
const map = require('unist-util-map');
const smartypants = require('retext-smartypants');

function reformat({ content: { mdast } }) {
  const smart = retext().use(smartypants);

  map(mdast, (node) => {
    if (node.type === 'text') {
      // eslint-disable-next-line no-param-reassign
      node.value = smart.processSync(node.value).contents;
    }
  });

  return { content: { mdast } };
}

module.exports = reformat;
