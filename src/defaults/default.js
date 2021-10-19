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
const { SimpleInterface, ConsoleLogger } = require('@adobe/helix-log');
const Pipeline = require('../pipeline.js');

/**
 * Constructs a pipeline function that is capable of
 * - calling a continuation function
 * - wrapping the response in a friendly response format
 * @param {Function} next the continuation function
 * @param {Object} context the initial context
 * @param {Object} action the action
 * @returns {Function} a function to execute.
 */
function pipe(next, context, action) {
  const mypipeline = new Pipeline(action);
  mypipeline.use(next);
  return mypipeline.run(context);
}

/**
 *
 * @param {Function} cont the continuation function
 * @returns {Function} the wrapped main function
 */
const pre = (cont) => cont;

const log = new SimpleInterface({
  level: 'debug',
  logger: new ConsoleLogger(),
});
// keep backward compatible with winston logger
log.log = (level, ...msg) => log._logImpl(level, ...msg, {});

const defaults = {
  pipe,
  pre,
  log,
};

module.exports = defaults;
