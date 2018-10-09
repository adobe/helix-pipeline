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
const Ajv = require('ajv');
const fs = require('fs-extra');
const path = require('path');

const ajv = new Ajv({allErrors: true, verbose: true});
const schemadir = path.dirname(__dirname);
fs.readdirSync(schemadir)
  .filter(file => file.match(/\.schema\.json$/))
  .map(file => {
    ajv.addSchema(fs.readJSONSync(path.resolve(schemadir, file)));
  });

function validate(context, action, index) {
  const cvalid = ajv.validate('https://ns.adobe.com/helix/pipeline/context', context);
  if (!cvalid) {
    action.logger.warn(`Invalid Context at step ${index}, ${ajv.errorsText()}`);
    throw new Error(`Invalid Context at step ${index}
${ajv.errorsText()}`);
  }
  const avalid = ajv.validate('https://ns.adobe.com/helix/pipeline/action', action);
  if (!avalid) {
    action.logger.warn(`Invalid Action at step ${index}, ${ajv.errorsText()}`);
    throw new Error(`Invalid Action at step ${index}
${ajv.errorsText()}`);
  }
}

module.exports = validate;
