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

const fallback = require('mdast-util-to-hast/lib/handlers/link');
const url = require('url');
const clone = require('clone');


function link() {
  return function handler(h, node, children) {
    const n = clone(node);
    const parts = url.parse(n.url);
    if (!parts.protocol && parts.path) {
      n.url = n.url.replace(parts.path, parts.path.replace(/\.md/, '.html'));
    }
    return fallback(h, n, children);
  };
}

module.exports = link;
