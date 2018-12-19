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
 * Returns true when run inside an OpenWhisk action, false otherwise.
 */
function production() {
  try {
    // eslint-disable-next-line no-underscore-dangle
    return process && process.env && !!process.env.__OW_ACTIVATION_ID;
  } catch (e) {
    // this error only occurs when running inside OpenWhisk
    return true;
  }
}

module.exports = production;
