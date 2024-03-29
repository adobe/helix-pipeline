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
import crypto from 'crypto';
import { setdefault } from 'ferrum';

export default async function fetchContent(context, {
  request, downloader, secrets, logger,
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

  let contentProxyUrl;
  if (secrets.CONTENT_PROXY_URL) {
    contentProxyUrl = new URL(secrets.CONTENT_PROXY_URL);
    contentProxyUrl.searchParams.append('owner', owner);
    contentProxyUrl.searchParams.append('repo', repo);
    contentProxyUrl.searchParams.append('path', path);
    contentProxyUrl.searchParams.append('ref', refOrBranch); // prefer ref for content fetching
  } else {
    let label = `${branchOrRef}--${repo}--${owner}`;
    if (label.length > 64) {
      label = `${repo}--${owner}`;
      logger.warn(`hostname label too long. fall back to ${label}`);
    }
    contentProxyUrl = new URL(`https://${label}.hlx.page${path}`);
  }

  // append raw root if different from default
  const repoRawRoot = new URL(secrets.REPO_RAW_ROOT);
  if (repoRawRoot.href !== 'https://raw.githubusercontent.com/') {
    contentProxyUrl.searchParams.append('REPO_RAW_ROOT', repoRawRoot.href);
  }
  const headers = {};
  const token = (secrets && secrets.GITHUB_TOKEN) || (request.headers ? request.headers['x-github-token'] : '');
  if (token) {
    headers['x-github-token'] = token;
  }

  try {
    logger.info(`loading from content proxy: ${contentProxyUrl}`);
    const res = await downloader.fetch({
      uri: contentProxyUrl.href,
      options: {
        timeout: secrets.HTTP_TIMEOUT_EXTERNAL,
        headers,
        cache: 'no-store',
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

    const lastModified = res.headers.get('last-modified');
    logger.info(`last-modified: ${lastModified}`);
    if (lastModified) {
      context.content.data = { ...context.content.data, lastModified };
    }
  } catch (err) {
    // throw error if no status error
    /* istanbul ignore next */
    if (!err.status) {
      throw err;
    }
    // ignore
  }
}
