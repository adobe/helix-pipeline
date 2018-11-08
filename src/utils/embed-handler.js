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
/**
 * Handles `embed` MDAST nodes by converting them into `<esi:include>` tags
 * @param {string} EMBED_SERVICE the URL of an embedding service compatible with https://github.com/adobe/helix-embed that returns HTML
 */
function embed({ EMBED_SERVICE = 'https://adobeioruntime.net/api/v1/web/helix/default/embed/' } = {}) {
  return function handler(h, node) {
    const { url } = node;
    const props = {
      src: EMBED_SERVICE + url,
    };
    return h(node, 'esi:include', props);
  };
}

module.exports = embed;
