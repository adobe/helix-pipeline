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
const remove = require('unist-util-remove');
const visit = require('unist-util-visit');
const {
  deepclone, trySlidingWindow, map, list, reject, contains, is, pipe,
} = require('ferrum');
const removePosition = require('unist-util-remove-position');
const dotprop = require('dot-prop');

const pattern = /{{([^{}]+)}}/g;
/**
 * Copied from 'unist-util-map' and promisified.
 * @param tree
 * @param iteratee
 * @returns {Promise<any>}
 */
async function pmap(tree, iteratee) {
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

/**
 * Finds all MDAST nodes that have a placeholder value and calls
 * a user-provided callback function.
 * @param {MDAST} section an MDAST node
 * @param {*} handlefn a callback function to handle the placeholder
 */
function findPlaceholders(section, handlefn) {
  visit(section, (node) => {
    if (node.value && pattern.test(node.value)) {
      handlefn(node, 'value');
    }
    if (node.alt && pattern.test(node.alt)) {
      handlefn(node, 'alt');
    }
    if (node.url && pattern.test(node.url)) {
      handlefn(node, 'url');
    }
    if (node.title && pattern.test(node.title)) {
      handlefn(node, 'title');
    }
  });
}

/**
 * Determines if an MDAST node contains placeholders like `{{foo}}`
 * @param {MDAST} section
 */
function hasPlaceholders(section) {
  try {
    findPlaceholders(section, () => {
      throw new Error('Placeholder detected');
    });
    return false;
  } catch {
    return true;
  }
}

/**
 * @param {MDAST} section
 */
function fillPlaceholders(section) {
  if (!section.meta || (!section.meta.embedData && !Array.isArray(section.meta.embedData))) {
    return;
  }
  const data = section.meta.embedData;
  // required to make deepclone below work
  removePosition(section);

  const children = data.reduce((p, value) => {
    const workingcopy = deepclone(section);

    findPlaceholders(workingcopy, (node, prop) => {
      if (typeof node[prop] === 'string') {
        node[prop] = node[prop].replace(pattern, (_, expr) => dotprop.get(value, expr));
      }
    });
    return [...p, ...workingcopy.children];
  }, []);

  section.children = children;
  delete section.meta.embedData;
}

function normalizeLists(section) {
  function cleanupLists([first, second]) {
    // two consecutive, identical lists
    if (first.type === 'list' && second.type === 'list'
        && first.ordered === second.ordered
        && first.start === second.start
        && first.spread === second.spread) {
      // move the children of the first to the second list
      second.children = [...first.children, ...second.children];
      first.children = [];
      // mark the first list to be emptied
      return first;
    }
    return null;
  }

  // get the sequence of lists to be removed
  const emptiedLists = pipe(
    trySlidingWindow(section.children, 2),
    map(cleanupLists),
    reject(is(null)),
    list,
  );

  // perform the cleanup
  section.children = pipe(
    section.children, // take all existing children
    reject((child) => contains(is(child))(emptiedLists)), // reject if they are in the list above
    list, // make a nice array because the rest of the world doesn't like iterators yet
  );
}

async function fillDataSections({ content: { mdast } }, { downloader, logger }) {
  async function extractData(section) {
    return pmap(section, async (node) => {
      if (node.type === 'dataEmbed') {
        const task = downloader.getTaskById(`dataEmbed:${node.url}`);
        const downloadeddata = await task;
        if (downloadeddata.status !== 200) {
          logger.warn(`Bad status code (${downloadeddata.status}) for data embed ${node.url}`);
          return node;
        }
        try {
          const json = JSON.parse(downloadeddata.body);
          if (!Array.isArray(json)) {
            logger.warn(`Expected array for data embed ${node.url}, got ${typeof json}`);
            return node;
          }
          section.meta.embedData = json;
        } catch (e) {
          logger.warn(`Unable to parse JSON for data embed ${node.url}: ${e.message}`);
          return node;
        }
      }
      return node;
    });
  }

  async function applyDataSections(section) {
    await extractData(section);
    remove(section, 'dataEmbed');
    fillPlaceholders(section);
    normalizeLists(section);
  }

  const dataSections = selectAll('section', mdast);

  // extract data from all sections
  await Promise.all(dataSections
    .filter(hasPlaceholders)
    .map(applyDataSections));

  if (dataSections.length === 0 && hasPlaceholders(mdast)) {
    // extract data from the root node (in case there are no sections)
    await applyDataSections(mdast);
  }

  remove(mdast, 'dataEmbed');
}

module.exports = fillDataSections;
