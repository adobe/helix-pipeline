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
const URI = require('uri-js');
const { setdefault } = require('ferrum');
const { fetch, TimeoutError } = require('@adobe/helix-fetch');

function computeURI(root, owner, repo, ref, path) {
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
async function fetchFileInRepo(path, context, { secrets = {}, request, logger }) {
  // get required request parameters
  const {
    REPO_RAW_ROOT: rootPath,
    HTTP_TIMEOUT: timeout,
  } = secrets;

  const { owner, repo, branch } = request.params;
  const ref = request.params.ref || 'master';

  // everything looks good, prepare the HTTP request
  const options = {
    timeout,
    cache: request.headers ? request.headers['Cache-Control'] : '',
  };

  // if there is a github token, send it in the Authorization header
  const token = secrets.GITHUB_TOKEN || (request.headers ? request.headers['x-github-token'] : '');
  if (token) {
    setdefault(options, 'headers', {
      Authorization: `token ${token}`,
    });
  }

  // compute the URI
  const uri = computeURI(rootPath, owner, repo, ref, path);

  logger.debug(`fetching file from ${uri}`);
  return fetch(uri, options)
    .then((res) => {
      if (!res.ok) {
        res.options = options;
        return Promise.reject(res);
      }
      // Update sources
      if (branch && branch !== ref) {
        setdefault(context.content, 'sources', []).push(computeURI(rootPath, owner, repo, branch, path));
      } else {
        setdefault(context.content, 'sources', []).push(uri);
      }
      return Promise.resolve(res);
    });
}

async function fetchMarkdown(context, { secrets = {}, request, logger }) {
  const { content } = context;
  const { path } = request.params;

  // get required request parameters
  return fetchFileInRepo(path, context, { secrets, request, logger })
    .then(async (res) => {
      content.body = res && await res.text();
    })
    .catch((err) => {
      if (err.status === 404) {
        logger.error(`Could not find file at ${err.url}`);
        setdefault(context, 'response', {}).status = 404;
      } else if (err.status === 502 || err instanceof TimeoutError) {
        logger.error(`Gateway timeout of ${secrets.HTTP_TIMEOUT} milliseconds exceeded for ${err.url}`);
        setdefault(context, 'response', {}).status = 504;
      } else {
        logger.error(`Error while fetching file from ${err.url} with the following `
                    + `options:\n${inspect(err.options, { depth: null })}`);
        setdefault(context, 'response', {}).status = 502;
      }
      if (err instanceof Error) {
        context.error = err;
        return err;
      } else {
        return err.text().then((msg) => {
          context.error = new Error(msg);
        });
      }
    });
}

async function fetchAll(context, action) {
  setdefault(context, 'content', {});

  const { request, secrets = {}, logger } = action;
  if (!request || !request.params) {
    throw new Error('Request parameters missing');
  }

  if (!secrets.HTTP_TIMEOUT) {
    logger.warn('No HTTP timeout set, risk of denial-of-service');
  }

  // get required request parameters
  const {
    owner, repo, ref, path,
  } = request.params;

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
  }

  return fetchMarkdown(context, action);
}

module.exports = fetchAll;
module.exports.uri = computeURI;
