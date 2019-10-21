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
const DEBUG_TEMPLATE =
  "<script>console.group('context');console.log(CONTEXT_JSON);console.groupEnd();</script>";

function debug(context, { logger }) {
  const isDebug =
    context.request &&
    context.request.params &&
    (context.request.params.debug === true ||
      context.request.params.debug === "true");
  const hasBody = context.response && context.response.body;

  if (!isDebug || !hasBody) {
    return;
  }

  logger.debug("Adding debug script");
  // backup body
  const { body } = context.response;

  // remove body because that would be the response content
  // and causes rendering issues of the script
  delete context.response.body;

  const debugScript = DEBUG_TEMPLATE.replace(
    /CONTEXT_JSON/,
    JSON.stringify(context)
  );
  // inject debug script before the closing body tag
  context.response.body = body.replace(/<\/body>/i, `${debugScript}</body>`);
}
module.exports = debug;
module.exports.DEBUG_TEMPLATE = DEBUG_TEMPLATE;
