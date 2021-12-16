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
import { all } from 'mdast-util-to-hast';
import { wrap } from 'mdast-util-to-hast/lib/wrap.js';

const HELIX_NAMESPACE = 'hlx-';
const DEFAULT_SECTION_TAG = 'div';
const DEFAULT_SECTION_CLASS = `${HELIX_NAMESPACE}section`;
const SYSTEM_META_PROPERTIES = ['tagname'];
const SYSTEM_HTML_ATTRIBUTES = ['types'];
const GLOBAL_HTML_ATTRIBUTES = [
  'accesskey', 'autocapitalize', 'class', 'contenteditable', 'contextmenu', 'dir', 'draggable', 'dropzone', 'hidden',
  'id', 'inputmode', 'is', 'itemid', 'itemprop', 'itemref', 'itemscope', 'itemtype', 'lang', 'slot', 'spellcheck',
  'style', 'tabindex', 'title', 'translate',
];

/**
 * Get the tag name for the specified section.
 *
 * @param {Node} section The MDAST section to get the tag name for
 * @returns {string} The tag name for the section. Defaults to {@code div}.
 */
function getTagName(section) {
  return (section.meta && section.meta.tagname) || DEFAULT_SECTION_TAG;
}

function toHtmlAttribute(value) {
  return Array.isArray(value) ? value.join(' ') : value;
}

function getAttributes(section) {
  const attributeKeys = Object.keys(section.meta);
  // Add system properties as data-hlx-*
  const attributes = attributeKeys
    .filter((k) => SYSTEM_HTML_ATTRIBUTES.indexOf(k) > -1)
    .reduce((result, attr) => Object.assign(result, { [`data-${HELIX_NAMESPACE}${attr}`]: toHtmlAttribute(section.meta[attr]) }), {});
  return attributeKeys
    .filter((k) => [...SYSTEM_HTML_ATTRIBUTES, ...SYSTEM_META_PROPERTIES].indexOf(k) === -1)
    .reduce((result, attr) => {
      // Add invalid HTML attributes as data-*
      if (GLOBAL_HTML_ATTRIBUTES.indexOf(attr) === -1 && !attr.startsWith('data-')) {
        return Object.assign(result, { [`data-${attr}`]: toHtmlAttribute(section.meta[attr]) });
      }
      // Add valid HTML attributes
      return Object.assign(result, { [attr]: toHtmlAttribute(section.meta[attr]) });
    }, attributes);
}

export default function sectionHandler() {
  return function handler(h, node) {
    const n = { ...node };

    const tagName = getTagName(n);
    const props = getAttributes(n);
    props.class = props.class ? `${DEFAULT_SECTION_CLASS} ${props.class}` : DEFAULT_SECTION_CLASS;
    const children = wrap(all(h, n), true);

    return h(node, tagName, props, children);
  };
}
