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

/**
 * Handles `icon` MDAST nodes by converting them into `img` or `<svg>` tags, e.g.
 * `<img class="icon icon-smile" src="/icons/smile.svg"/>` or
 * `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-smile"><use href="/icons.svg#smile"></use></svg>`
 * @param {string} id the identifier of the icon
 */
function icon() {
  return function handler(h, node) {
    let { value } = node;
    value = encodeURIComponent(value);
    if (value.startsWith('%23')) {
      // icon starts with #
      value = value.substring(3);
      return [h(node, 'svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        className: `icon icon-${value}`,
      }, [h(node, 'use', {
        href: `/icons.svg#${value}`,
      })])];
    } else {
      return [h(node, 'img', {
        className: `icon icon-${value}`,
        src: `/icons/${value}.svg`,
        alt: `${value} icon`,
      })];
    }
  };
}

module.exports = icon;
