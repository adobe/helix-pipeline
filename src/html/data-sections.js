/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import { selectAll } from 'unist-util-select';
import { remove } from 'unist-util-remove';
import { visitParents } from 'unist-util-visit-parents';
import { parse, resolve } from 'uri-js';
import nodePath from 'path';
import dotprop from 'dot-prop';
import { removePosition } from 'unist-util-remove-position';
import {
  contains,
  deepclone,
  is,
  list,
  map,
  pipe,
  reject,
  setdefault,
  trySlidingWindow,
} from 'ferrum';
import { merge } from '../utils/cache-helper.js';

const pattern = /{{([^{}]+)}}/g;
/**
 * Copied from 'unist-util-map' and promisified.
 * @param tree
 * @param iteratee
 * @returns {Promise<any>}
 */
async function pmap(tree, iteratee) {
  async function preorder(node) {
    async function bound(child) {
      return preorder(child);
    }
    const { children } = node;
    const newNode = { ...await iteratee(node) };

    if (children) {
      newNode.children = await Promise.all(children.map(bound));
    }
    return newNode;
  }
  return preorder(tree);
}

/**
 * Finds all MDAST nodes that have a placeholder value and calls
 * a user-provided callback function.
 * @param {MDAST} section an MDAST node
 * @param {*} handlefn a callback function to handle the placeholder
 */
function findPlaceholders(section, handlefn) {
  visitParents(section, (node, ancestors) => {
    if (node.value && pattern.test(node.value)) {
      handlefn(node, 'value', ancestors);
    }
    if (node.alt && pattern.test(node.alt)) {
      handlefn(node, 'alt', ancestors);
    }
    if (node.url && pattern.test(node.url)) {
      handlefn(node, 'url', ancestors);
    }
    if (node.title && pattern.test(node.title)) {
      handlefn(node, 'title', ancestors);
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

export function paginate(limit, page = 1) {
  const upper = limit * page;
  const lower = limit * (page - 1);
  return (_, index) => !limit || (upper > index && lower <= index);
}

/**
 * @param {MDAST} section
 */
function fillPlaceholders(section, contentext, resourceext, baseurl, selector, hlxPage, hlxLimit) {
  if (!section.meta || (!section.meta.embedData && !Array.isArray(section.meta.embedData))) {
    return;
  }

  const limit = section.meta.hlx_limit || parseInt(hlxLimit, 10); // cannot be overridden
  const page = parseInt(hlxPage, 10) || section.meta.hlx_page || 1; // can be overridden

  const data = section.meta.embedData;
  // required to make deepclone below work
  removePosition(section);

  // no need to copy the full dataset over and over
  delete section.meta.embedData;

  const children = data
    .filter(paginate(limit, page))
    .reduce((p, value) => {
      const workingcopy = deepclone(section);

      findPlaceholders(workingcopy, (node, prop, ancestors) => {
        if (node.type === 'text'
          && ancestors.length === 2
          && ancestors[1].type === 'paragraph'
          && node[prop].replace(pattern, (_, expr) => dotprop.get(value, expr)).match('^[/.].*') && (
          node[prop].replace(pattern, (_, expr) => dotprop.get(value, expr)).endsWith(resourceext)
        || node[prop].replace(pattern, (_, expr) => dotprop.get(value, expr)).endsWith(contentext)
        )) {
          const parent = ancestors[1];
          // construct an embed node
          const uri = parse(resolve(baseurl, node[prop]
            .replace(pattern, (_, expr) => dotprop.get(value, expr))));
          node[prop] = node[prop]
            .replace(pattern, (_, expr) => dotprop.get(value, expr));
          const childNodes = [{ ...parent }];
          parent.type = 'embed';
          parent.children = childNodes;
          parent.url = nodePath.resolve(nodePath.dirname(uri.path), `${nodePath.basename(uri.path, nodePath.extname(uri.path))}.${selector}${resourceext}`);
          delete parent.value;
        } else if (typeof node[prop] === 'string') {
          node[prop] = node[prop].replace(pattern, (_, expr) => dotprop.get(value, expr));
        }
      });
      return [...p, ...workingcopy.children];
    }, []);

  section.children = children;
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

export default async function fillDataSections(context, {
  downloader,
  logger,
  secrets: { EMBED_SELECTOR },
  request: { params: { path } },
}) {
  const {
    content: { mdast },
    request: { extension, url, params: { hlx_limit: l, hlx_page: p } = {} },
  } = context;

  const resourceext = `.${extension}`;
  const contentext = nodePath.extname(path);

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
          // be compatible with old and new data format.
          // see https://github.com/adobe/helix-data-embed/issues/119
          const data = json.data ? json.data : json;
          if (!Array.isArray(data)) {
            logger.warn(`Expected array for data embed ${node.url}, got ${typeof data}`);
            return node;
          }
          section.meta.embedData = data;

          // remember that we are using this source so that we can compute the
          // surrogate key later
          setdefault(context.content, 'sources', []);
          context.content.sources.push(node.url);

          // pass the cache control header through
          const res = setdefault(context, 'response', {});
          const headers = setdefault(res, 'headers', {});

          headers['Cache-Control'] = merge(
            headers['Cache-Control'],
            downloadeddata.headers.get('cache-control'),
          );
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
    fillPlaceholders(section, contentext, resourceext, url, EMBED_SELECTOR, p, l);
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
