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
const _ = require('lodash');
const sanitize = require('hast-util-sanitize');
const GITHUB_SCHEMA = require('hast-util-sanitize/lib/github');

// Define helix specific customizations on top of the default GitHub schema
const HELIX_SCHEMA_CUSTOMIZATIONS = {
  tagNames: ['esi:include'],
  attributes: {
    'esi:include': ['src'],
    code: ['className'],
    img: ['sizes', 'srcset'],
  },
};

/**
 * A customizer function for lodash's mergeWith method that concats arrays.
 * @param {*} obj The object to merge into
 * @param {*} src The object to merge from
 * @returns {Array<Object>} the concatenanted array or undefined if the object is not an array
 */
function arrayMergeCustomizer(obj, src) {
  if (_.isArray(obj)) {
    return obj.concat(src);
  }
  return undefined;
}

// Define the sanitization schema for helix
const HELIX_SCHEMA = _.mergeWith(
  GITHUB_SCHEMA,
  HELIX_SCHEMA_CUSTOMIZATIONS,
  arrayMergeCustomizer,
);

module.exports = hast => sanitize(hast, HELIX_SCHEMA);
