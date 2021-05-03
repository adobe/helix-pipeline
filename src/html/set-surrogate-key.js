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
const { type } = require('ferrum');
const { map, join, setdefault } = require('ferrum');
const { computeSurrogateKey } = require('@adobe/helix-shared-utils');

function key(context, { logger }) {
  const cont = setdefault(context, 'content', {});
  const res = setdefault(context, 'response', {});
  const headers = setdefault(res, 'headers', {});

  // somebody already set a surrogate key
  if (headers['Surrogate-Key'] || !(type(cont.sources) === Array)) {
    logger.debug('Keeping existing Surrogate-Key header');
    return;
  }

  logger.debug('Setting Surrogate-Key header');
  headers['Surrogate-Key'] = join(' ')(map(cont.sources, computeSurrogateKey));
}

module.exports = key;
