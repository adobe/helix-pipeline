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
const DEBUG_TEMPLATE = '<script>console.group(\'payload\');console.log(PAYLOAD_JSON);console.groupEnd();</script>';

function debug(payload, { logger }) {
  const isDebug = payload.request && payload.request.params && (payload.request.params.debug === true || payload.request.params.debug === 'true');
  const hasBody = payload.response && payload.response.body;
  if (isDebug && hasBody) {
    logger.debug('Adding debug script');
    const p = payload;
    // backup body
    const { body } = p.response;
    // remove body because that would be the response content
    // and causes rendering issues of the script
    delete p.response.body;
    const debugScript = DEBUG_TEMPLATE.replace(/PAYLOAD_JSON/, JSON.stringify(p));
    // inject debug script before the closing body tag
    p.response.body = body.replace(/<\/body>/i, `${debugScript}</body>`);
    return p;
  }
  return payload;
}
module.exports = debug;
module.exports.DEBUG_TEMPLATE = DEBUG_TEMPLATE;
