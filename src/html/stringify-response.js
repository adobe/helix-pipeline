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
function stringify({ response }, { logger }) {
  if (response.body) {
    logger.debug("stringify: ignoring already defined context.response.body");
    return;
  }
  if (!response.document) {
    throw Error("no response");
  }
  const doc = response.document;
  if (doc.serialize) {
    response.body = doc.serialize();
  } else if (doc.doctype) {
    response.body = `<!DOCTYPE ${doc.doctype.name}>${doc.documentElement.outerHTML}`;
  } else if (doc.documentElement) {
    response.body = doc.documentElement.outerHTML;
  } else if (doc.innerHTML) {
    response.body = doc.innerHTML;
  } else {
    throw Error(`unexpected context.response.document: ${doc}`);
  }
}

module.exports = stringify;
