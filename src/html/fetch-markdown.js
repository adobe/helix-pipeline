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
const client = require('request-promise-native');
const URI = require('uri-js');
const { bail } = require('../helper');

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
 * Fetches the Markdown specified in the action and returns
 * the body of the Markdown document
 * @param {import("../context").Context} ctx some param
 * @param {import("../context").Action} action some other param
 */
async function fetch(
  { content: { sources = [] } = {} },
  {
    secrets = {},
    request,
    logger,
  },
) {
  if (!request || !request.params) {
    return bail(logger, 'Request parameters are missing');
  }

  let timeout;
  if (!secrets.HTTP_TIMEOUT) {
    logger.warn('No HTTP timeout set, risk of denial-of-service');
  } else {
    timeout = secrets.HTTP_TIMEOUT;
  }

  // get required request parameters
  const {
    owner, repo, path,
  } = request.params;

  let { ref } = request.params;

  // bail if a required parameter cannot be found
  if (!owner) {
    return bail(logger, 'Unknown owner, cannot fetch content');
  }
  if (!repo) {
    return bail(logger, 'Unknown repo, cannot fetch content');
  }
  if (!path) {
    return bail(logger, 'Unknown path, cannot fetch content');
  }
  if (!ref) {
    logger.warn(`Recoverable error: no ref given for ${repo}/${owner}.git${path}, falling back to master`);
    ref = 'master';
  }

  const { REPO_RAW_ROOT: rootPath } = secrets;

  // everything looks good, make the HTTP request
  const options = {
    uri: uri(rootPath, owner, repo, ref, path),
    json: false,
    timeout,
  };
  logger.debug(`fetching Markdown from ${options.uri}`);
  try {
    const response = await client(options);
    return {
      content: {
        body: response,
        sources: [...sources, options.uri],
      },
    };
  } catch (e) {
    if (e && e.statusCode && e.statusCode === 404) {
      return bail(logger, `Could not find Markdown at ${options.uri}`, e, 404);
    } if (e && e.cause && e.cause.code && (e.cause.code === 'ESOCKETTIMEDOUT' || e.cause.code === 'ETIMEDOUT')) {
      // return gateway timeout
      return bail(logger, `Gateway timout of ${timeout} milliseconds exceeded for ${options.uri}`, e, 504);
    }
    // return a bad gateway for all other errors
    return bail(logger, `Could not fetch Markdown from ${options.uri}`, e, 502);
  }
}

module.exports = fetch;
module.exports.uri = uri;
