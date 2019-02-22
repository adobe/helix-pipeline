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

function setVerboseError(error) {
  const res = {
    response: {
      status: 500,
      body: `<html><body><h1>500</h1><pre>${error}</pre></body></html>`,
      headers: {
        'Content-Type': 'text/html',
      },
    },
  };
  return res;
}

function selectStatus(prod) {
  return ({ response = {}, error }, { logger }) => {
    // if a status is already default, keep it.
    if (response.status) {
      return {};
    }
    if (!error) {
      return {
        response: {
          status: 200,
        },
      };
    }
    // error handling
    logger.debug('payload.error -> 500');
    if (prod) {
      return {
        response: {
          status: 500,
          body: '',
        },
      };
    }
    return setVerboseError(error);
  };
}

function setStatus({ response = {}, error }, { logger }) {
  return selectStatus(false)({ response, error }, { logger });
}

module.exports = setStatus;
module.exports.selectStatus = selectStatus;
