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
const crypto = require('crypto');

function key({ content, response }, { logger }) {
  // somebody already set a surrogate key
  if (!(response && response.headers && response.headers['Surrogate-Key']) && (content && content.sources && Array.isArray(content.sources))) {
    logger.debug('Setting Surrogate-Key header');
    return {
      response: {
        headers: {
          'Surrogate-Key': content.sources.map((uri) => {
            const hash = crypto.createHash('sha256');
            hash.update(uri);
            return hash.digest('base64');
          }).join(' '),
        },
      },
    };
  }
  logger.debug('Keeping existing Surrogate-Key header');
  return {};
}
module.exports = key;
