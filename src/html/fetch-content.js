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
const crypto = require('crypto');
const { setdefault } = require('ferrum');

async function fetchContent(context, {
  request, downloader, secrets, logger, versionLock,
}) {
  setdefault(context, 'content', {});
  /* istanbul ignore next */
  if (!request || !request.params) {
    throw new Error('Request parameters missing');
  }
  const { content } = context;
  const {
    owner, repo, path, branch, ref,
  } = request.params;
  const branchOrRef = branch || ref || 'master';
  const refOrBranch = ref || branch || 'master';

  // compute content proxy url
  let contentProxyUrl = secrets.CONTENT_PROXY_URL || '';
  if (!contentProxyUrl) {
    const namespace = process.env.__OW_NAMESPACE || 'helix';
    contentProxyUrl = `https://adobeioruntime.net/api/v1/web/${namespace}/helix-services/content-proxy@v1`;
  }
  contentProxyUrl = versionLock.transformActionURL(contentProxyUrl);

  const url = new URL(contentProxyUrl);
  url.searchParams.append('owner', owner);
  url.searchParams.append('repo', repo);
  url.searchParams.append('path', path);
  url.searchParams.append('ref', refOrBranch); // prefer ref for content fetching

  // append raw root if different from default
  const repoRawRoot = new URL(secrets.REPO_RAW_ROOT);
  if (repoRawRoot.href !== 'https://raw.githubusercontent.com/') {
    url.searchParams.append('REPO_RAW_ROOT', repoRawRoot.href);
  }
  const headers = {};
  const token = (secrets && secrets.GITHUB_TOKEN) || (request.headers ? request.headers['x-github-token'] : '');
  if (token) {
    headers['x-github-token'] = token;
  }

  try {
    logger.debug(`loading from content proxy: ${url}`);
    const res = await downloader.fetch({
      uri: url.href,
      options: {
        timeout: secrets.HTTP_TIMEOUT_EXTERNAL,
        headers,
      },
      errorOn404: false,
    });
    // if 404, return and let the fetch-markdown try to load the resource.
    if (res.status === 404) {
      return;
    }

    content.body = res.body;

    // prefer branch for surrogate computation
    const source = downloader.computeGithubURI(owner, repo, branchOrRef, path);
    setdefault(content, 'sources', []).push(source);

    // store extra source location if present
    const sourceLocation = res.headers.get('x-source-location') || '';
    if (sourceLocation && sourceLocation !== source) {
      content.sources.push(sourceLocation);
    }
    const sourceHash = crypto.createHash('sha1').update(sourceLocation).digest('base64').substring(0, 16);
    logger.info(`source-location: ${sourceLocation}`);
    logger.info(`source-hash: ${sourceHash}`);
    context.content.data = {
      sourceLocation,
      sourceHash,
    };
  } catch (err) {
    // throw error if no status error
    /* istanbul ignore next */
    if (!err.status) {
      throw err;
    }
    // ignore
  }
}

module.exports = fetchContent;
