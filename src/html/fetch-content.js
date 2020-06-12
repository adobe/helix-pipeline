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
const { setdefault } = require('ferrum');

async function fetchContent(context, {
  request, downloader, secrets, logger,
}) {
  setdefault(context, 'content', {});
  /* istanbul ignore next */
  if (!request || !request.params) {
    throw new Error('Request parameters missing');
  }
  const { content } = context;
  const {
    owner, repo, path, branch = 'master', ref,
  } = request.params;

  // don't use content-proxy for localhost
  const repoRawRoot = new URL(secrets.REPO_RAW_ROOT);
  /* istanbul ignore if */
  if (repoRawRoot.hostname === 'localhost' || repoRawRoot.hostname === '127.0.0.1') {
    // this is not testable, since the nock interceptor don't work on localhost and http2.. ??..
    logger.debug(`ignore content proxy for ${repoRawRoot}`);
    return;
  }

  // compute content proxy url
  let contentProxyUrl = secrets.CONTENT_PROXY_URL || '';
  if (!contentProxyUrl) {
    const namespace = process.env.__OW_NAMESPACE || 'helix';
    contentProxyUrl = `https://adobeioruntime.net/api/v1/web/${namespace}/helix-services/content-proxy@v1`;
  }

  const url = new URL(contentProxyUrl);
  url.searchParams.append('owner', owner);
  url.searchParams.append('repo', repo);
  url.searchParams.append('path', path);
  url.searchParams.append('ref', ref || branch);

  // append raw root if different from default
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
      errorOn404: true,
    });

    content.body = res.body;

    setdefault(context.content, 'sources', []).push(downloader.computeGithubURI(owner, repo, branch, path));
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
