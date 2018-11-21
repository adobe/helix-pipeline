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
const parse = require('xml2js').parseString;

function check({ response }, { logger }) {
  if (response.body) {
    logger.debug('Validating XML');
    parse(response.body, { trim: true }, (err) => {
      if (err) {
        throw new Error(`Error parsing XML: ${err}`);
      }
      return { response };
    });
  }
  logger.debug('No XML to validate');
  return { response };
}

module.exports = check;
