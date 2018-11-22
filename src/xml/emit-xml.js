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

const builder = require('xmlbuilder');

function emit({ content, response }, { secrets, logger }) {
  if (response.body) {
    logger.debug('Response body already exists');
    return {};
  }
  if (content.xml) {
    const pretty = secrets.XML_PRETTY || false;
    try {
      logger.debug(`Emitting XML from ${typeof content.xml}`);
      const xml = builder.create(content.xml, { encoding: 'utf-8' });
      return {
        response: {
          body: xml.end({ pretty }),
        },
      };
    } catch (e) {
      logger.error(`Error building XML: ${e}`);
      return {};
    }
  }
  logger.debug('No XML to emit');
  return {};
}

module.exports = emit;
