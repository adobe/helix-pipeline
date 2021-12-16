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

import { pipe, pre, log } from './src/defaults/default.js';

import vdom from './src/utils/mdast-to-vdom.js';
import types from './src/utils/match-section-types.js';

export { default as Pipeline } from './src/pipeline.js';
export { default as UniversalAction } from './src/universal.js';

/**
 * @module pipeline
 * @typedef {import("./src/action").Action} Action
 * @typedef {import("./src/context").Context} Context
 */

export const utils = {
  vdom,
  types,
};

export const defaults = {
  pipe,
  pre,
  log,
};
