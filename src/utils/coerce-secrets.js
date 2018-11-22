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
const ajv = require('./validator');

async function coerce(action) {
  const defaultsetter = await ajv(action.logger, { useDefaults: true, coerceTypes: true });
  if (!action.secrets) {
    /* eslint-disable no-param-reassign */
    action.secrets = {};
  }
  action.logger.debug('Coercing secrets');
  defaultsetter.validate('https://ns.adobe.com/helix/pipeline/secrets', action.secrets);
}

module.exports = coerce;
