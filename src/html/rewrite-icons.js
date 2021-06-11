/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const REGEXP_ICON = /:(#?[a-zA-Z_-]+[a-zA-Z0-9]*):/g;

/**
 * Create a <img> or <svg> icon dom element eg:
 * `<img class="icon icon-smile" src="/icons/smile.svg"/>` or
 * `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-smile"><use href="/icons.svg#smile"></use></svg>`
 * @param {Document} document the dom document
 * @param {string} value the identifier of the icon
 */
function createIcon(document, value) {
  value = encodeURIComponent(value);

  // icon starts with #
  if (value.startsWith('%23')) {
    value = value.substring(3);
    const $el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    $el.classList.add('icon', `icon-${value}`);
    const $use = document.createElement('use');
    $use.setAttribute('href', `/icons.svg#${value}`);
    $el.appendChild($use);
    return $el;
  }

  // create normal image
  const $el = document.createElement('img');
  $el.classList.add('icon', `icon-${value}`);
  $el.setAttribute('src', `/icons/${value}.svg`);
  $el.setAttribute('alt', `${value} icon`);
  return $el;
}

/**
 * Rewrite :icons:
 *
 * @param {Document} document The (vdom) document
 */
function rewriteIcons(document) {
  const { NodeFilter } = document.window;
  const nodeIterator = document.createNodeIterator(
    document.body,
    NodeFilter.SHOW_TEXT,
  );

  let textNode;
  // eslint-disable-next-line no-cond-assign
  while (textNode = nodeIterator.nextNode()) {
    const text = textNode.data;
    let lastIdx = 0;
    for (const match of text.matchAll(REGEXP_ICON)) {
      const [matched, icon] = match;
      const before = text.substring(lastIdx, match.index);
      if (before) {
        textNode.parentNode.insertBefore(document.createTextNode(before), textNode);
      }
      textNode.parentNode.insertBefore(createIcon(document, icon), textNode);
      lastIdx = match.index + matched.length;
    }

    if (lastIdx && lastIdx <= text.length) {
      // there is still some text left
      const after = text.substring(lastIdx);
      if (after) {
        textNode.data = after;
      } else {
        textNode.remove();
      }
    }
  }
}

function rewrite({ content }) {
  if (content.document) {
    rewriteIcons(content.document);
  }
}

module.exports = rewrite;
