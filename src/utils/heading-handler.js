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

/**
 * Generates a valid HTML identifier from the string
 * @param {string} text The text to use to generate the identifier
 * @returns {string} the string for the identifier
 */
function generateId(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // replace non-alphanumerical characters by '-'
    .replace(/-+/g, '-') // replace consecutive '-' by a single instance
    .replace(/(^-|-$)/g, ''); // trim leading and tailing '-';
}

/**
 * Gets the list of parent heading nodes for the specified heading.
 * @param {UnistParent~Parent} parent The parent node for the MDAST
 * @param {UnistParent~Heading} heading The heading node to get the parents of
 * @returns {UnistParent~Heading[]} The list of parent headings
 */
function getParentHeadings(parent, heading) {
  const currentHeadingIndex = parent.children.indexOf(heading);
  let { depth } = heading;
  let parentHeadings = parent.children.slice(0, currentHeadingIndex).filter(n => n.type === 'heading');
  parentHeadings = parentHeadings.reverse().reduce((headings, h) => {
    if (h.depth < depth) {
      headings.push(h);
      depth -= 1;
    }
    return headings;
  }, []);
  return parentHeadings.reverse();
}

function headingHandler() {
  return function handler(h, node, parent) {
    // Prepare the heading id (prefixed with the ids of its parent headings)
    const headings = getParentHeadings(parent, node);
    headings.push(node);
    const headingsIdentifier = headings.map(heading => generateId(heading.children[0].value)).join('--');

    // Inject the id after transformation
    const n = Object.assign({}, node);
    const el = fallback(h, n);
    el.properties.id = headingsIdentifier;
    return el;
  };
}

module.exports = headingHandler;
