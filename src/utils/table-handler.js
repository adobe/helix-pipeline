/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import { table as fallback } from 'mdast-util-to-hast/lib/handlers/table.js';

export default function table() {
  return function handler(h, node) {
    // remove 'none' from align
    if (node.align) {
      for (let i = 0; i < node.align.length; i += 1) {
        if (node.align[i] === 'none') {
          node.align[i] = null;
        }
      }
    }
    return fallback(h, node);
  };
}
