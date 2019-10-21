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

const { setdefault } = require("ferrum");

function emit(context, { logger }) {
  const content = setdefault(context, "content", {});
  const response = setdefault(context, "response", {});

  if (response.body) {
    logger.debug("Response body already exists");
    return;
  }
  if (!content.json) {
    logger.debug("No JSON to emit");
    return;
  }

  logger.debug(`Emitting JSON from ${typeof content.json}`);
  response.body = JSON.parse(JSON.stringify(content.json));
}

module.exports = emit;
