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

const selectStatus = (context, { logger }) => {
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

  // error handling
  logger.debug('context.error -> 500');
  res.status = 500;
  res.body = '';

  if (!isProduction()) {
    res.body = `<html><body><h1>500</h1><pre>${err}</pre></body></html>`;
    headers['Content-Type'] = 'text/html';
  }
};

module.exports = selectStatus;
