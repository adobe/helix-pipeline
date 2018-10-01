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
const URI = require('uri-js');
const { bail } = require('../helper');

const GH_RAW = 'https://raw.githubusercontent.com/';

function uri(root, owner, repo, ref, path) {
  const rootURI = URI.parse(root);
  const rootPath = rootURI.path;
  // remove double slashes
  const fullPath = `${rootPath}/${owner}/${repo}/${ref}/${path}`.replace(
    /\/+/g,
    '/',
  );

  return URI.serialize({
    scheme: rootURI.scheme,
    host: rootURI.host,
    port: rootURI.port,
    path: fullPath,
  });
}

/**
 * @param {import("../context").Context} ctx some param
 * @param {import("../context").Action} action some other param
 */
function foo(ctx, action) {
  ctx.
}

/**
 * Fetches the Markdown specified in the action and returns
 * the body of the Markdown document
 * @param {object} context pipeline context/payload
 * @param {object} context.content existing content (should be empty)
 * @param {string[]} context.content.sources list of URLs that have been retrieved for
 * this piece of content
 * @param {string} context.error pre-existing error message
 * @param {object} action the pipeline action
 * @param {object} action.request the HTTP request made to the runtime function
 * @param {object} action.request.params URL params of the runtime function
 * @param {string} action.request.params.owner organization or username owning the repository
 * @param {string} action.request.params.repo name of the repository
 * @param {string} action.request.params.ref branch, tag or commit identifier
 * @param {string} action.request.params.path path of the file to be requested
 */
function fetch(
  { error, content: { sources = [] } = {} },
  {
    secrets = {},
    request,
    logger,
  },
) {
  if (error) {
    // don't do anything if there is an error
    return {};
  }
  if (!request || !request.params) {
    return bail(logger, 'Request parameters are missing');
  }

  // get required request parameters
  const {
    owner, repo, ref, path,
  } = request.params;

  // bail if a required parameter cannot be found
  if (!owner) {
    return bail(logger, 'Unknown owner, cannot fetch content');
  }
  if (!repo) {
    return bail(logger, 'Unknown repo, cannot fetch content');
  }
  if (!ref) {
    return bail(logger, 'Unknown ref, cannot fetch content');
  }
  if (!path) {
    return bail(logger, 'Unknown path, cannot fetch content');
  }

  const { REPO_RAW_ROOT: rootPath = GH_RAW } = secrets;

  // everything looks good, make the HTTP request
  const options = {
    uri: uri(rootPath, owner, repo, ref, path),
    json: false,
  };
  logger.debug(`fetching Markdown from ${options.uri}`);
  return client(options)
    .then(resp => ({ content: { body: resp, sources: [...sources, options.uri] } }))
    .catch(err => bail(logger, `Could not fetch Markdown from ${options.uri}`, err));
}
module.exports = fetch;
module.exports.uri = uri;
