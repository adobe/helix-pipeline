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
const url = require('uri-js');

/**
 * Creates an array of widths based on a set of options
 * @param {object} options a set of parameters
 * to generate an array of options
 * @param {number} options.from smallest possible size
 * @param {number} options.to largest possible size
 * @param {number} options.steps number of steps
 */
function makewidths(options) {
  const { from, to } = options;
  const range = to - from;
  const steps = Math.max(2, options.steps);
  const widths = new Array(steps + 1).fill(undefined);

  return widths.map((_, i) => Math.round(from + (i * range / steps)));
}

function image({
  IMAGES_MIN_SIZE,
  IMAGES_MAX_SIZE,
  IMAGES_SIZE_STEPS,
  IMAGES_SIZES,
} = {}) {
  const widths = {
    from: parseInt(IMAGES_MIN_SIZE, 10),
    to: parseInt(IMAGES_MAX_SIZE, 10),
    steps: parseInt(IMAGES_SIZE_STEPS, 10),
  };

  const sizes = IMAGES_SIZES ? IMAGES_SIZES.split(',') : [];

  /* Transform an image. */
  return function handler(h, node) {
    const srcurl = url.parse(node.url);
    if (srcurl.scheme) {
      return fallback(h, node);
    }

    const props = {
      src: normalize(node.url),
      alt: node.alt,
    };

    if (sizes.length > 0) {
      props.srcset = makewidths(widths).map(width => `${srcurl.path}?width=${width}&auto=webp ${width}w`).join(',');
      props.sizes = sizes.join(', ');
    }

    if (node.title !== null && node.title !== undefined) {
      props.title = node.title;
    }

    return h(node, 'img', props);
  };
}

module.exports = image;
