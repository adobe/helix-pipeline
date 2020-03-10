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
const { selectAll } = require('unist-util-select');

/**
 * Copied from 'unist-util-map' and promisified.
 * @param tree
 * @param iteratee
 * @returns {Promise<any>}
 */
async function map(tree, iteratee) {
  async function preorder(node, index, parent) {
    async function bound(child, idx) {
      return preorder(child, idx, node);
    }
    const { children } = node;
    const newNode = { ...await iteratee(node, index, parent) };

    if (children) {
      newNode.children = await Promise.all(children.map(bound));
    }
    return newNode;
  }
  return preorder(tree, null, null);
}

async function data({ content: { mdast } }, { downloader }) {
  async function extractData(section) {
    return map(section, async (node) => {
      if (node.type === 'dataEmbed') {
        const task = downloader.getTaskById(`dataEmbed:${node.url}`);
        const downloadeddata = await task;
        console.log('task data', downloadeddata);
        const json = await downloadeddata.json();
        console.log('data', json);
        section.meta.embedData = json;
        node.type = 'delete';
      }
      return node;
    });
  }

  const dataSections = selectAll('section', mdast);
  console.log('dataSections', dataSections);
  // extract data from all sections
  await Promise.all(dataSections.map(extractData));
  // extract data from the root node (in case there are no sections)
  await extractData(mdast);
  console.log('found data sections', dataSections.length);
}

module.exports = data;
