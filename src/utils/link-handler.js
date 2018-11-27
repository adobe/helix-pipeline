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
const uri = require('uri-js');

function link({ extension = 'html' } = {}) {
  return function handler(h, node) {
    const n = Object.assign({}, node);
    const uriParts = uri.parse(n.url);
    if (!uriParts.scheme && uriParts.path) {
      uriParts.path = uriParts.path.replace(/\.md$/, `.${extension}`);
      n.url = uri.serialize(uriParts);
    }
    return fallback(h, n);
  };
}

module.exports = link;
