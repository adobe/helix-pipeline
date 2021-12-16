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
import { map } from 'unist-util-map';

/**
 * Unwraps hero images to avoid the unnecessary paragraph.
 *
 * @param {object} request The content request
 */
export default function unwrap({ content }) {
  let sections = content.mdast.children.filter((node) => node.type === 'section');
  if (!sections.length) {
    sections = [content.mdast];
  }
  sections.forEach((section) => {
    map(section, (node, index, parent) => {
      if (node.type === 'paragraph' // If we have a paragraph
          && (parent.type === 'root' // … in the document root
            || parent.type === 'section') // … or in a section
          && parent.meta.types.includes('has-only-image') // … that only has images
          && parent.meta.types.includes('nb-image-1')) { // … and actually only 1 of them
        // … then consider it a hero image, and unwrap from the paragraph
        const position = parent.children.indexOf(node);
        const [img] = parent.children[position].children;
        parent.children[position] = img;
      }
    });
  });
}
