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
const { inspect } = require('util');
const client = require('request-promise-native');
const URI = require('uri-js');
const { setdefault } = require('ferrum');

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
async function fetch(context, { secrets = {}, request, logger }) {
  const content = setdefault(context, 'content', {});

  if (!request || !request.params) {
    throw new Error('Request parameters missing');
  }

  let timeout;
  if (!secrets.HTTP_TIMEOUT) {
    logger.warn('No HTTP timeout set, risk of denial-of-service');
  } else {
    timeout = secrets.HTTP_TIMEOUT;
  }

  // get required request parameters
  const {
    owner, repo, path, branch,
  } = request.params;

  let { ref } = request.params;

  // bail if a required parameter cannot be found
  if (!owner) {
    throw new Error('Unknown owner, cannot fetch content');
  }
  if (!repo) {
    throw new Error('Unknown repo, cannot fetch content');
  }
  if (!path) {
    throw new Error('Unknown path, cannot fetch content');
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
    time: true,
  };

  // if there is a github token, send it in the Authorization header
  const token = secrets.GITHUB_TOKEN || (request.headers ? request.headers['x-github-token'] : '');
  if (token) {
    setdefault(options, 'headers', {}).Authorization = `token ${token}`;
  }

  logger.debug(`fetching Markdown from ${options.uri}`);
  try {
    content.body = await client(options);
    if (branch && branch !== ref) {
      setdefault(content, 'sources', []).push(uri(rootPath, owner, repo, branch, path));
    } else {
      setdefault(content, 'sources', []).push(options.uri);
    }
  } catch (e) {
    if (e.statusCode === 404) {
      logger.error(`Could not find Markdown at ${options.uri}`);
      setdefault(context, 'response', {}).status = 404;
    } else if ((e.response && e.response.elapsedTime && e.response.elapsedTime > timeout) || (e.cause && e.cause.code && (e.cause.code === 'ESOCKETTIMEDOUT' || e.cause.code === 'ETIMEDOUT'))) {
      // return gateway timeout
      logger.error(`Gateway timeout of ${timeout} milliseconds exceeded for ${options.uri}`);
      setdefault(context, 'response', {}).status = 504;
    } else {
      logger.error(`Error while fetching Markdown from ${options.uri} with the following `
                   + `options:\n${inspect(options, { depth: null })}`);
      setdefault(context, 'response', {}).status = 502;
    }
    context.error = e;
  }
}

module.exports = fetch;
module.exports.uri = uri;
