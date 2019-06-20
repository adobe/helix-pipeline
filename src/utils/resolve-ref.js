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
const rp = require('request-promise-native');
const URI = require('uri-js');
const openwhisk = require('openwhisk');

const REGEXP_SHA = /^[0-9a-f]{40}$/i;

/**
 * Calls the lookup service either by invoking the action directly or fetching the result via
 * http request.
 *
 * @param {string} urlOrName - The service url or action name.
 * @param {object} params - the action params.
 * @returns {object} The result object.
 */
async function callService(urlOrName, params) {
  if (!urlOrName.startsWith('https://')) {
    // assume openwhisk action
    if (!process.env.__OW_API_KEY) {
      throw Error('cannot invoke action outside openwhisk environment.');
    }
    const ow = openwhisk();
    const res = await ow.actions.invoke({
      name: urlOrName,
      blocking: true,
      result: true,
      params,
    });
    return res.body;
  }
  const result = await rp({
    url: urlOrName,
    qs: params,
    json: true,
  });
  if (result.status === 'error') {
    throw Error(result.statusMessage);
  }
  return result;
}

/**
 * Resolves the 'ref' of a github request if it's not already a SHA.
 * The function uses the resolve-git-ref service API which needs to be provided via the
 * {@code secrets.API_RESOLVE_GIT_REF} parameter. If the 'ref' looks already like a commit SHA,
 * the lookup is ignored.
 * After a successful lookup the {@code action.request.params.ref} is replaced with the SHA.
 *
 * @see https://github.com/adobe/helix-resolve-git-ref
 */
async function resolveRef(context, { secrets = {}, request, logger }) {
  if (!request || !request.params) {
    throw new Error('Request parameters missing');
  }
  if (!secrets.REPO_RAW_ROOT) {
    logger.debug('cannot resolve ref. No REPO_RAW_ROOT specified.');
    return;
  }
  const rootURI = URI.parse(secrets.REPO_RAW_ROOT);
  if (rootURI.host !== 'raw.github.com' && rootURI.host !== 'raw.githubusercontent.com') {
    logger.warn(`unable to resolve ref to non-github repository: ${secrets.REPO_RAW_ROOT}`);
    return;
  }

  const lookupUrl = secrets.RESOLVE_GITREF_SERVICE;
  if (!lookupUrl) {
    logger.debug('ignoring github ref resolving. RESOLVE_GITREF_SERVICE is not set.');
    return;
  }

  // get required request parameters
  const {
    owner, repo,
  } = request.params;

  let { ref } = request.params;
  if (!owner) {
    throw new Error('Unknown owner, cannot resolve github ref');
  }
  if (!repo) {
    throw new Error('Unknown repo, cannot resolve github ref');
  }
  if (!ref) {
    logger.warn(`Recoverable error: no ref given for ${repo}/${owner}, falling back to master`);
    ref = 'master';
  }

  if (REGEXP_SHA.test(ref)) {
    logger.debug(`github-ref '${ref}' looks like a SHA. Ignoring resolving.`);
    return;
  }

  try {
    const result = await callService(lookupUrl, {
      owner,
      repo,
      ref,
    });
    logger.debug(`resolved github-ref '${ref}' to '${result.sha}'`);
    request.params.ref = result.sha;
  } catch (e) {
    logger.debug(`unable to resolve github-ref of ${ref}: ${e.message}`);
  }
}

module.exports = resolveRef;
