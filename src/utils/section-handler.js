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

const fallback = require('mdast-util-to-hast/lib/handlers/root');
const all = require('mdast-util-to-hast/lib/all');
const wrap = require('mdast-util-to-hast/lib/wrap');

/**
 * Get the tag name for the specified section.
 *
 * @param {Node} section The MDAST section to get the tag name for
 * @returns {string} The tag name for the section. Defaults to {@code div}.
 */
function getTageName(section) {
  return (section.data && section.data.meta && section.data.meta.tagName) || 'div';
}

/**
 * Get the class name for the specified section.
 *
 * @param {Node} section The MDAST section to get the class name for
 * @returns {string} The class name for the section. Defaults to {@code hlx-section}.
 */
function getClass(section) {
  return (section.data && section.data.meta && section.data.meta.className) || 'hlx-section';
}

/**
 * Get the types for the specified section.
 *
 * @param {Node} section The MDAST section to get the types for
 * @returns {string} A space-separated list of section types, or {@code null} if none desired.
 */
function getTypes(node) {
  const outputTags = node.data && node.data.meta && node.data.meta.types === true;
  const types = (outputTags && node.data.types) || null;
  return types ? types.join(' ') : null;
}

function sectionHandler() {
  return function handler(h, node, parent) {
    const n = Object.assign({}, node);

    // we have a section that is not the document root, so wrap it in the desired tag
    if (parent && parent.type === 'root') {
      const tagName = getTageName(n);
      const props = { class: getClass(n), 'data-hlx-types': getTypes(n) };
      const children = wrap(all(h, n), true);
      return h(node, tagName, props, children);
    }

    return fallback(h, n);
  };
}

module.exports = sectionHandler;
