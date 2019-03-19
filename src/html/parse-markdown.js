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
const unified = require('unified');
const remark = require('remark-parse');
const frontmatter = require('remark-frontmatter');
const map = require('unist-util-map');
const { safeLoad } = require('js-yaml');

/* eslint-disable no-param-reassign */

/**
 * Injects the `newkids` into the `parent`'s list of children
 * in place of `node`
 * @param {Node} parent the parent node
 * @param {Node} node the child to be replaced
 * @param {Node[]} newkids the new child nodes
 */
function inject(parent, node, newkids) {
  const index = parent.children.indexOf(node);
  const before = parent.children.slice(0, index);
  const after = parent.children.slice(index + 1);

  parent.children = [...before, ...newkids, ...after];
}

const thbreak = {
  type: 'thematicBreak',
};

function parse({ content: { body = '' } = {} }, { logger }) {
  logger.debug(`Parsing markdown from request body starting with ${body.split('\n')[0]}`);

  const preprocessor = unified()
    .use(remark)
    .use(frontmatter, { type: 'yaml', marker: '-', anywhere: true });

  // see https://github.com/syntax-tree/mdast for documentation
  const mdast = preprocessor.parse(body);

  map(mdast, (node, index, parent) => {
    if (node.type === 'yaml') {
      try {
        const val = safeLoad(node.value);
        if (typeof val !== 'object') {
          throw Error('not an object');
        }
      } catch (e) {
        const inner = preprocessor.parse(node.value);
        inject(parent, node, [thbreak, ...inner.children, thbreak]);
      }
    }
  });

  return { content: { mdast } };
}

parse.ext = 'parse';

module.exports = parse;
