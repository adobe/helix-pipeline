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

const defaults = require('./src/defaults/default.js');
const Pipeline = require('./src/pipeline.js');
const OpenWhiskAction = require('./src/utils/openwhisk.js');
const UniversalAction = require('./src/universal.js');
const utils = require('./src/utils');

/**
 * @module pipeline
 * @typedef {import("./src/action").Action} Action
 * @typedef {import("./src/context").Context} Context
 */

module.exports = {
  Pipeline,
  defaults,
  utils,
  OpenWhiskAction,
  UniversalAction,
};
