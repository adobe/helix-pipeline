/*
 * Copyright 2021 Adobe. All rights reserved.
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

function lastModified(context, { logger }) {
  const content = setdefault(context, 'content', {});
  const res = setdefault(context, 'response', {});
  const headers = setdefault(res, 'headers', {});

  // somebody already set a last-modified key
  if (headers['Last-Modified']) {
    logger.debug('Keeping existing Last-Modified header');
    return;
  }
  if (content.data) {
    const { data: { lastModified: lastModifiedDateTime } } = content;
    if (lastModifiedDateTime) {
      logger.debug('Setting Last-Modified header');
      headers['Last-Modified'] = lastModifiedDateTime;
    }
  }
}

module.exports = lastModified;
