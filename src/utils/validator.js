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
import Ajv from 'ajv';
import hash from 'object-hash';
import util from 'util';
import SCHEMAS from '../schemas/index.cjs';

const _ajv = {};

export default function ajv(logger, options = {}) {
  const key = hash(options);
  if (!_ajv[key]) {
    logger.debug(`initializing ajv ${JSON.stringify(options)}`);
    const validator = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false,
      validateFormats: false,
      ...options,
    });
    SCHEMAS.forEach((schemaData) => {
      validator.addSchema(schemaData);
      logger.debug(`- ${schemaData.$id}`);
    });

    validator.enhancedErrorsText = function enhancedErrorsText(errs, opts = {}) {
      const errors = errs || this.errors;
      /* istanbul ignore next */
      if (!errors) {
        return 'No errors';
      }

      const separator = opts.separator === undefined
        ? /* istanbul ignore next */ '\n'
        : /* istanbul ignore next */ opts.separator;

      let text = '';
      errors.forEach((err) => {
        /* istanbul ignore next */
        if (err) {
          if (err.data && err.data.type) {
            text += `${err.data.type}${err.schemaPath} ${err.message} - path: ${err.dataPath}${separator}`;
          } else if (typeof err.data !== 'object') {
            text += `${err.schemaPath} ${err.message} - params: ${JSON.stringify(util.inspect(err.params))} - value: ${err.data} - path: ${err.dataPath}${separator}`;
          } else {
            text += `${err.schemaPath} ${err.message} - params: ${JSON.stringify(util.inspect(err.params))} - path: ${err.dataPath}${separator}`;
          }
        }
      });
      return text.slice(0, -separator.length);
    }.bind(validator);

    logger.debug('ajv initialized');
    _ajv[key] = validator;
  }
  return _ajv[key];
}
