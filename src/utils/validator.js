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
/* eslint-disable no-underscore-dangle */
const Ajv = require('ajv');
const fs = require('fs-extra');
const path = require('path');
const hash = require('object-hash');

const _ajv = {};

function ajv(logger, options = {}) {
  if (!_ajv[hash(options)]) {
    logger.debug(`initializing ajv ${JSON.stringify(options)}`);
    const schemadir = path.resolve(__dirname, '..', 'schemas');
    const validator = new Ajv(Object.assign({ allErrors: true, verbose: true }, options));
    // compromise: in order to avoid async code here 
    // (which would complicate pipeline implementation considerably) 
    // we're using static file names and synchronous reads/requires (#134)
    const schemaFiles = [
      `${schemadir}/action.schema.json`,
      `${schemadir}/content.schema.json`,
      `${schemadir}/context.schema.json`,
      `${schemadir}/mdast.schema.json`,
      `${schemadir}/meta.schema.json`,
      `${schemadir}/position.schema.json`,
      `${schemadir}/rawrequest.schema.json`,
      `${schemadir}/request.schema.json`,
      `${schemadir}/response.schema.json`,
      `${schemadir}/secrets.schema.json`,
      `${schemadir}/section.schema.json`,
      `${schemadir}/textcoordinates.schema.json`,
    ];
    schemaFiles.forEach((schemaFile) => {
      const schemaData = require(schemaFile);
      validator.addSchema(schemaData);
      logger.debug(`- ${schemaData.$id}  (${path.basename(schemaFile)})`);
    });
    logger.debug('ajv initialized');
    _ajv[hash(options)] = validator;
  }
  return _ajv[hash(options)];
}

module.exports = ajv;
