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
const fallback = require('mdast-util-to-hast/lib/handlers/heading');
const HtmlId = require('./generate-html-id');

let headingIdentifiersCache = {};

/**
 * Gets the text content for the specified heading.
 * @param {UnistParent~Heading} heading The heading node
 * @returns {string} The text content for the heading
 */
function getTextContent(heading) {
  return heading.children
    .filter(el => el.type === 'text')
    .map(el => el.value)
    .join('').trim();
}

/**
 * Suffix the specified heading identifier to avoid collisions with existing headings.
 * @param {string} headingIdentifier The heading identifier
 * @returns {string} The suffixed heading identifier
 */
function suffixHeadingIdentifier(headingIdentifier) {
  // If heading is of the form `foo`, turn it to `foo-1`
  // If heading is of the form `foo-1` already, turn it to `foo-1-1`
  const headingIdentifierRoot = headingIdentifier.replace(/-\d+$/, '');
  headingIdentifiersCache[headingIdentifier] = headingIdentifiersCache[headingIdentifier]
    || (headingIdentifiersCache[headingIdentifierRoot] ? 1 : 0);

  let suffix = '';
  headingIdentifiersCache[headingIdentifier] = headingIdentifiersCache[headingIdentifier] || 0;
  if (headingIdentifiersCache[headingIdentifier] > 0) {
    suffix = `-${headingIdentifiersCache[headingIdentifier]}`;
  }
  headingIdentifiersCache[headingIdentifier] += 1;

  return headingIdentifier + suffix;
}

function headingHandler() {
  return function handler(h, node, parent) {
    // Reset heading cache on 1st heading
    if (node === parent.children.filter(el => el.type === 'heading')[0]) {
      headingIdentifiersCache = {};
    }

    // Prepare the heading id (prefixed with the ids of its parent headings)
    let headingIdentifier = HtmlId.generateId(getTextContent(node));

    // Verify existing headings for a collision and append a suffix if needed
    headingIdentifier = suffixHeadingIdentifier(headingIdentifier, headingIdentifiersCache);

    // Inject the id after transformation
    const n = Object.assign({}, node);
    const el = fallback(h, n);
    el.properties.id = headingIdentifier;
    return el;
  };
}

module.exports = headingHandler;
