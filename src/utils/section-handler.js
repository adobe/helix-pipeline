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
const all = require('mdast-util-to-hast/lib/all');
const wrap = require('mdast-util-to-hast/lib/wrap');

const DEFAULT_SECTION_TAG = 'div';
const DEFAULT_SECTION_CLASS = 'hlx-section';
const SYSTEM_META_PROPERTIES = ['class', 'meta', 'tagname', 'types'];

/**
 * Get the tag name for the specified section.
 *
 * @param {Node} section The MDAST section to get the tag name for
 * @returns {string} The tag name for the section. Defaults to {@code div}.
 */
function getTagName(section) {
  return (section.meta && section.meta.tagname) || DEFAULT_SECTION_TAG;
}

/**
 * Get the types for the specified section.
 *
 * @param {Node} section The MDAST section to get the types for
 * @returns {string[]} A list of section types.
 */
function getTypes(node) {
  const outputTags = node.meta && node.meta.types === true;
  const types = (outputTags && node.types) || [];
  return types;
}

/**
 * Get the class name for the specified section.
 *
 * @param {Node} section The MDAST section to get the class name for
 * @returns {string} A space-seperated list of class names for the section.
 *    Defaults to {@code hlx-section}.
 */
function getClass(section) {
  const sectionClass = (section.meta && section.meta.class) || DEFAULT_SECTION_CLASS;
  const sectionTypes = getTypes(section);
  return [sectionClass, ...sectionTypes].join(' ');
}

/**
 * Get the meta attributes for the specified section.
 *
 * @param {Node} section The MDAST section to get the class name for
 * @returns {string} The class name for the section. Defaults to {@code hlx-section}.
 */
function getMeta(section) {
  let metaKeys = [];
  if (section.meta.meta === true) {
    metaKeys = Object.keys(section.meta)
      .filter(prop => SYSTEM_META_PROPERTIES.indexOf(prop) === -1);
  }
  return metaKeys.reduce((props, key) => {
    props[`data-hlx-${key}`] = section.meta[key];
    return props;
  }, {});
}

function sectionHandler() {
  return function handler(h, node) {
    const n = Object.assign({}, node);

    const tagName = getTagName(n);
    const props = Object.assign({ class: getClass(n) }, getMeta(n));
    const children = wrap(all(h, n), true);
    return h(node, tagName, props, children);
  };
}

module.exports = sectionHandler;
