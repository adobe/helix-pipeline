/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const helixSanitizationConfig = {
  ADD_TAGS: ['esi:include', 'esi:remove'],
  RETURN_DOM: true,
};

function sanitize({ content }, { logger }) {
  logger.log('debug', 'Sanitizing content body to avoid XSS injections.');

  const globalContext = (new JSDOM('')).window;
  const DOMPurify = createDOMPurify(globalContext);
  const sanitizedBody = DOMPurify.sanitize(content.document.body, helixSanitizationConfig);
  return {
    content: {
      document: {
        body: sanitizedBody,
      },
    },
  };
}

module.exports = sanitize;
