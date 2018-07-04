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

function bail(logger, message) {
  logger.error(message);
  return { error: { message } };
}

function uri(rootPath, owner, repo, ref, path) {
  const cleanroot = rootPath.replace(/\/$/, '');
  const cleanpath = path.replace(/^\//, '');
  const cleanref = ref.replace(/^\//, '').replace(/\/$/, '');
  const cleanowner = owner.replace(/^\//, '').replace(/\/$/, '');
  const cleanrepo = repo.replace(/^\//, '').replace(/\/$/, '');

  return `${cleanroot}/${cleanowner}/${cleanrepo}/${cleanref}/${cleanpath}`;
}

function fetch({ request, error }, { REPO_RAW_ROOT: rootPath = GH_RAW } = {}, logger) {
  if (error) {
    // don't do anything if there is an error
    return {};
  }

  // get required request parameters
  const {
    owner, repo, ref, path,
  } = request.params;

  // bail if a required parameter cannot be found
  if (!owner) {
    return bail(logger, 'Unknown owner, cannot fetch resource');
  }
  if (!repo) {
    return bail(logger, 'Unknown repo, cannot fetch resource');
  }
  if (!ref) {
    return bail(logger, 'Unknown ref, cannot fetch resource');
  }
  if (!path) {
    return bail(logger, 'Unknown path, cannot fetch resource');
  }

  // everything looks good, make the HTTP request
  const options = {
    uri: uri(rootPath, owner, repo, ref, path),
    json: false,
  };
  logger.debug(`fetching Markdown from ${options.uri}`);
  return client(options)
    .then(resp => ({ resource: { body: resp } }))
    .catch((err) => {
      logger.error(`Could not fetch Markdown from ${options.uri}`, err);
      return { error: err };
    });
}
module.exports = fetch;
module.exports.uri = uri;
