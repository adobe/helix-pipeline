/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const fallback = require('mdast-util-to-hast/lib/handlers').image;

function image() {
  return function handler(h, node) {
    // rewrite blob links to use Fastly
    if (/^https:\/\/hlx\.blob\.core\.windows\.net\/external\//.test(node.url)) {
      const patchednode = {
        ...node,
      };
      patchednode.url = `${node.url.replace(/^https:\/\/hlx\.blob\.core\.windows\.net\/external\//, '/hlx_')}.jpg`;
      return fallback(h, patchednode);
    }
    return fallback(h, node);
  };
}

module.exports = image;
