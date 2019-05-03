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
  // Allowing all ESI tags, see: https://www.w3.org/TR/esi-lang
  ADD_TAGS: [
    'esi:try',
    'esi:attempt',
    'esi:except',

    'esi:choose',
    'esi:when',
    'esi:otherwise',

    'esi:include',
    'esi:inline',
    'esi:remove',

    'esi:vars',
    'esi:comment',
  ],
  RETURN_DOM: true,
};

const CUSTOM_NAME_REGEX = /^\w+-\w+$/;

/**
 * Allow custom elements to be retained by the sanitization.
 *
 * @param {Object} DOMPurify the DOMPurify instance
 */
function allowCustomElements(DOMPurify) {
  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (node.nodeName && node.nodeName.match(CUSTOM_NAME_REGEX)) {
      data.allowedTags[data.tagName] = true; // eslint-disable-line no-param-reassign
    }
  });
}

/**
 * Allow custom attributes to be retained by the sanitization.
 *
 * @param {Object} DOMPurify the DOMPurify instance
 */
function allowCustomAttributes(DOMPurify) {
  DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
    if (data.attrName && data.attrName.match(CUSTOM_NAME_REGEX)) {
      data.allowedAttributes[data.attrName] = true; // eslint-disable-line no-param-reassign
    }
  });
}

function sanitize({ content }, { logger }) {
  logger.log('debug', 'Sanitizing content body to avoid XSS injections.');

  const globalContext = (new JSDOM('')).window;
  const DOMPurify = createDOMPurify(globalContext);
  allowCustomElements(DOMPurify);
  allowCustomAttributes(DOMPurify);
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
