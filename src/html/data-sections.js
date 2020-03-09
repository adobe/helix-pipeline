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
const map = require('unist-util-map');

async function data({ content: { mdast } }, { downloader }) {
  async function extractData(section) {
    map(section, async (node) => {
      if (node.type === 'dataEmbed') {
        const downloadeddata = await downloader.getTaskById(`dataEmbed:${node.url}`);
        console.log('data', await downloadeddata.json());
        section.meta.embedData = await downloadeddata.json();
        node.type = 'delete';
      }
      return node;
    });
  }

  const dataSections = selectAll('section', mdast);
  // extract data from all sections
  await dataSections.forEach(extractData);
  // extract data from the root node (in case there are no sections)
  await extractData(mdast);
  console.log('found data sections', dataSections.length);
}

module.exports = data;
