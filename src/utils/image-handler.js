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

const fallback = require('mdast-util-to-hast/lib/handlers/image');
const normalize = require('mdurl/encode');
const url = require('url');

/**
 * Creates an array of widths based on a set of options
 * @param {(object|number[])} options either an array of sizes or a set of parameters
 * to generate an array of options
 * @param {number} options.from smallest possible size
 * @param {number} options.to largest possible size
 * @param {number} options.steps number of steps
 */
function makewidths(options) {
  if (Array.isArray(options)) {
    return options;
  }

  const { from, to } = options;
  const range = to - from;
  const steps = Math.max(2, options.steps);
  const widths = new Array(steps + 1).fill(undefined);

  return widths.map((_, i) => Math.round(from + (i * range / steps)));
}

function image({ widths, sizes = ['100vw'] } = { widths: { from: 480, to: 4096, steps: 4 }, sizes: ['100vw'] }) {
  /* Transform an image. */
  return function handler(h, node) {
    const srcurl = url.parse(node.url);
    if (srcurl.protocol) {
      return fallback(h, node);
    }

    const srcset = makewidths(widths).map(width => `${srcurl.path}?width=${width}&auto=webp ${width}w`).join();


    const props = {
      src: normalize(node.url), alt: node.alt, srcset, sizes: sizes.join(', '),
    };

    if (node.title !== null && node.title !== undefined) {
      props.title = node.title;
    }

    return h(node, 'img', props);
  };
}

module.exports = image;
