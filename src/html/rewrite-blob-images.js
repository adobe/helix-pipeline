/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const visit = require('unist-util-visit');

/**
 * Rewrite blob store image URLs to /hlx_* URLs
 *
 * @param {object} request The content request
 */
function rewrite({ content }) {
  if (!content.mdast) {
    return;
  }
  visit(content.mdast, (node) => {
    if (node.type === 'image'
      && /^https:\/\/hlx\.blob\.core\.windows\.net\/external\//.test(node.url)) {
      const { pathname, hash } = new URL(node.url);
      const filename = pathname.split('/').pop();
      const extension = hash.includes('.') ? hash.split('.').pop() : 'jpg';
      node.url = `./media_${filename}.${extension}`;
    }
  });
}

module.exports = rewrite;
