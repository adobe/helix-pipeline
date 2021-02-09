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
const visit = require('unist-util-visit');

const regexp = /:#?[a-zA-Z_-]+[a-zA-Z0-9]*:/g;

function iconize({ content }) {
  if (!content.mdast) {
    return;
  }
  visit(content.mdast, (node, index, parent) => {
    if (node.type === 'text') {
      const icons = node.value.match(regexp);
      if (icons) {
        let text = node.value;
        const nodes = [];
        const match = icons[0];
        const matchIndex = text.indexOf(match);
        if (matchIndex > 0) {
          // add node with the text before the icon
          nodes.push({
            type: 'text',
            value: text.substring(0, matchIndex),
          });
        }
        // add the icon node
        nodes.push({
          type: 'icon',
          value: match.substring(1, match.length - 1),
          code: match,
        });
        // truncate text
        text = text.substring(matchIndex + match.length);
        if (text.length > 0) {
          // add final node with the rest of the text
          nodes.push({
            type: 'text',
            value: text,
          });
        }
        // replace original text node
        parent.children.splice(index, 1, ...nodes);
      }
    }
  });
}

module.exports = iconize;
