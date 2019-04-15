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

/**
 * Normalize URLs...
 *
 * This is a very basic normalizer; it just replaces double-slashes in
 * the path and uses the URL class, so any invalid characters are replaced
 * with their percent-notation.
 *
 * @param {String|URL} url The url to normalize
 * @returns {String}
 */
const normalizeURL = (url) => {
  const r = new URL(url);
  r.pathname = r.pathname.replace(/\/+/g, '/');
  return r.toString();
};

module.exports = { normalizeURL };
