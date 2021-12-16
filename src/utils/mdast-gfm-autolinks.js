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
import { visit, CONTINUE, SKIP } from 'unist-util-visit';
import sax from 'sax';

const REGEXP = /(mailto:[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)|(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|(^|[^/])www\.[a-zA-Z0-9]+\.[^\s]{2,})|([a-z0-9_.-]+@[\da-z.-]+\.[a-z.]{2,6})/i;

const EMAIL = /([a-z0-9_.-]+@[\da-z.-]+\.[a-z.]{2,6})/i;

const EMPTY_TAGS = new Set([
  'area',
  'base',
  'basefont',
  'br',
  'col',
  'frame',
  'hr',
  'img',
  'input',
  'isindex',
  'link',
  'meta',
  'param',
]);

/**
 * Find link like patterns in text nodes and creates links.
 * matches:
 * - http(s:)//.../...
 * - www.adobe.com
 * - mailto:sdfsdf@sdsf.com
 *
 * @param {object} tree
 * @returns {object} The modified (original) tree.
 */
export default function autolink(tree) {
  const htmlParser = sax.parser(false, {
    trim: true,
    normalize: false,
    lowercase: true,
    xmlns: false,
    position: false,
    strictEntities: false,
  });

  let autoLink = true;
  const tags = [];

  htmlParser.onopentag = (tag) => {
    if (!tag.isSelfClosing && !EMPTY_TAGS.has(tag.name)) {
      tags.push(tag.name);
      autoLink = !tags.includes('a');
    }
  };
  htmlParser.onclosetag = (name) => {
    const idx = tags.lastIndexOf(name);
    if (idx >= 0) {
      tags.splice(idx);
    }
    autoLink = !tags.includes('a');
  };

  visit(tree, (node, index, parent) => {
    if (node.type === 'html') {
      htmlParser.write(node.value);
      return SKIP;
    }
    if (node.type === 'link') {
      return SKIP;
    }
    if (autoLink && node.type === 'text' && node.value) {
      const newNodes = [];
      const segs = node.value.split(REGEXP);
      if (segs.length === 1) {
        return CONTINUE;
      }
      node.value.split(REGEXP).forEach((seg) => {
        if (!seg) {
          // skip empty
          return;
        }
        if (seg.match(REGEXP)) {
          // test if email address
          let href = seg;
          if (!seg.startsWith('mailto:') && seg.match(EMAIL)) {
            href = `mailto:${seg}`;
          }
          newNodes.push({
            type: 'link',
            title: null,
            url: href,
            children: [{
              type: 'text',
              value: seg,
            }],
          });
        } else {
          newNodes.push({
            type: 'text',
            value: seg,
          });
        }
      });
      parent.children.splice(index, 1, ...newNodes);
      return index + newNodes.length;
    }
    return CONTINUE;
  });
  return tree;
}
