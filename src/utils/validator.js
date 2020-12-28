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
const Ajv = require('ajv').default;
const hash = require('object-hash');
const util = require('util');

const _ajv = {};

function ajv(logger, options = {}) {
  if (!_ajv[hash(options)]) {
    logger.debug(`initializing ajv ${JSON.stringify(options)}`);
    const validator = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false,
      validateFormats: false,
      ...options,
    });
    // ajvFormats(validator);
    // compromise: in order to avoid async code here
    // (which would complicate pipeline implementation considerably)
    // we're using static file names and synchronous reads/requires (#134)
    // using constants in the require functions allows packagers to include the schemas.
    [
      /* eslint-disable global-require */
      require('../schemas/action.schema.json'),
      require('../schemas/content.schema.json'),
      require('../schemas/context.schema.json'),
      require('../schemas/mdast.schema.json'),
      require('../schemas/meta.schema.json'),
      require('../schemas/position.schema.json'),
      require('../schemas/rawrequest.schema.json'),
      require('../schemas/request.schema.json'),
      require('../schemas/response.schema.json'),
      require('../schemas/secrets.schema.json'),
      require('../schemas/section.schema.json'),
      require('../schemas/textcoordinates.schema.json'),
      require('@adobe/helix-shared/src/schemas/markupconfig.schema.json'),
      require('@adobe/helix-shared/src/schemas/markup.schema.json'),
      require('@adobe/helix-shared/src/schemas/markupmapping.schema.json'),
      /* eslint-enable global-require */
    ].forEach((schemaData) => {
      validator.addSchema(schemaData);
      logger.debug(`- ${schemaData.$id}`);
    });

    validator.enhancedErrorsText = function enhancedErrorsText(errs, opts = {}) {
      const errors = errs || this.errors;
      if (!errors) return 'No errors';

      const separator = opts.separator === undefined ? '\n' : opts.separator;

      let text = '';
      errors.forEach((err) => {
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
    _ajv[hash(options)] = validator;
  }
  return _ajv[hash(options)];
}

module.exports = ajv;
