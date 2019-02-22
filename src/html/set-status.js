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
const production = require('../utils/is-production');

function setStatus({ response = {}, error }, { logger }) {
  // if a status is already default, keep it.
  if (response.status) {
    return {};
  }

  // if there is an error, send a 500
  if (error) {
    logger.debug('payload.error -> 500');
    const isDev = !production();
    const res = {
      status: 500,
    };
    if (isDev) {
      res.body = `<html><body><h1>500</h1><p>${error}</p></body></html>`;
      res.headers = { 'Content-Type': 'text/html' };
    } else {
      res.body = '';
    }
    return {
      response: res,
    };
  }

  return {
    response: {
      status: 200,
    },
  };
}
module.exports = setStatus;
