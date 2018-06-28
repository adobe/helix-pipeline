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
const client = require('request-promise');

const GH_RAW = 'https://raw.githubusercontent.com/';

function fetch({ REPO_RAW_ROOT: rootPath = GH_RAW } = {}) {
  return function fetchMarkdown({ request }) {
    const {
      owner, repo, ref, path,
    } = request.params;
    const options = {
      uri: `${rootPath}${owner}/${repo}/${ref}/${path}`,
      json: false,
    };
    return client(options)
      .then(resp => ({ resource: { body: resp } }))
      .catch(err => ({ error: err }));
  };
}
module.exports = fetch;
