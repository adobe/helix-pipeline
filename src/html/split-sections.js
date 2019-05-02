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

const between = require('unist-util-find-all-between');
const _ = require('lodash/fp');

function section(children) {
  return {
    type: 'section',
    children,
  };
}

function split({ content: { mdast = { children: [] } } }) {
  // filter all children that are either yaml or break blocks
  const dividers = mdast.children.filter(node => node.type === 'yaml' || node.type === 'thematicBreak')
  // then get their index in the list of children
    .map(node => mdast.children.indexOf(node));

  // find pairwise permutations of spaces between blocks
  // include the very start and end of the document
  const starts = [0, ...dividers];
  const ends = [...dividers, mdast.children.length];
  const sections = _.zip(starts, ends)
  // but filter out empty section
    .filter(([start, end]) => start !== end)
  // then return all nodes that are in between
    .map(([start, end]) => {
    // skip 'thematicBreak' nodes
      const index = mdast.children[start].type === 'thematicBreak' ? start + 1 : start;
      return section(between(mdast, index, end));
    });

  // FIXME: dirty hack until we disable pipeline merging
  for (let i = sections.length; i < mdast.children.length; i += 1) {
    sections.push({ type: 'null' });
  }
  return { content: { sections, mdast: { children: sections } } };
}

module.exports = split;
