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

const { setdefault } = require('ferrum');
const isProduction = require('../utils/is-production');

function setStatus(context, { logger, request = {} }) {
  const res = setdefault(context, 'response', {});
  const headers = setdefault(res, 'headers', {});
  const err = context.error;

  // if a status is already default, keep it.
  if (res.status) {
    return;
  }

  if (!err) {
    res.status = 200;
    return;
  }

  logger.debug('context.error -> 500');
  res.status = 500;
  res.body = '';

  if (!isProduction() || setdefault(request, 'headers', {})['x-debug']) {
    res.body = `<?xml version="1.0" encoding="utf-8"?><error><code>500</code><message>${err.trim()}</message></error>`;
    headers['Content-Type'] = 'application/xml';
  }
}

module.exports = setStatus;
