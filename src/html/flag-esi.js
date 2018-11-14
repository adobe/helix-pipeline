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
/**
 * Detects if ESI tags are used in the repose body. Intended to be used as
 * a predicate in the pipeline construction.
 * @param {Context} param0 the pipeline payload
 */
function esi({ response }) {
  return response && response.body && /<esi:include/.test(response.body);
}

/**
 * Flags the response as containing ESI by adding the `X-ESI: enabled` header
 */
function flag() {
  return {
    response: {
      headers: {
        'X-ESI': 'enabled',
      },
    },
  };
}

module.exports = {
  esi, flag,
};
