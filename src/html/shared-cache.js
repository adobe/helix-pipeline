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

const { setdefault, pairs, foldl } = require("ferrum");

function uncached({ response }) {
  return !(response && response.headers && response.headers["Cache-Control"]);
}

function cache(context) {
  const res = setdefault(context, "response", {});
  const headers = setdefault(res, "headers", {});
  const directives = {
    "s-maxage": 30 * 24 * 3600, // serve from cache (without revalidation) for 30 days
    "stale-while-revalidate": 365 * 24 * 3600 // serve stale (while revalidating in background) for a year
  };

  headers["Cache-Control"] = foldl(
    pairs(directives),
    "",
    (a, [key, value]) => `${a + (a ? ", " : "") + key}=${value}`
  );
}

module.exports = { uncached, cache };
