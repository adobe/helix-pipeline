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

const ajv = new Ajv();
ajv.addSchema(fs.readJSONSync(path.resolve(__dirname, '..', 'mdast.schema.json')));
ajv.addSchema(fs.readJSONSync(path.resolve(__dirname, '..', 'action.schema.json')));
ajv.addSchema(fs.readJSONSync(path.resolve(__dirname, '..', 'context.schema.json')));


function validate(context, action, index) {
  const cvalid = ajv.validate('https://ns.adobe.com/helix/pipeline/context', context);
  if (!cvalid) {
    console.log(ajv.errorsText(), context);
    throw new Error(`Invalid Context at step ${index}
${ajv.errorsText()}`);
  }
  const avalid = ajv.validate('https://ns.adobe.com/helix/pipeline/action', action);
  if (!avalid) {
    console.log(ajv.errorsText(), action);
    throw new Error(`Invalid Action at step ${index}
${ajv.errorsText()}`);
  }
}

module.exports = validate;
