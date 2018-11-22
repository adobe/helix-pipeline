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

function setStatus({ response = {}, error }, { logger }) {
  // if a status is already default, keep it.
  if (response.status) {
    return {};
  }

  // if there is an error, send a 500
  if (error) {
    logger.debug('payload.error -> 500');
    return {
      response: {
        status: 500,
        body: `<?xml version="1.0" encoding="utf-8"?><Error><Code>500</Code><Message>${error.trim()}</Message></Error>`,
      },
    };
  }

  return {
    response: {
      status: 200,
    },
  };
}
module.exports = setStatus;
