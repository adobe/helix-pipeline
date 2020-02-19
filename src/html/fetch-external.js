/*
 * Copyright 2020 Adobe. All rights reserved.
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
const { MountConfig } = require('@adobe/helix-shared');

async function fetchExternal(context, { logger, request, downloader }) {
  setdefault(context, 'content', {});
  // check for fstab
  const fstabTask = downloader.getTaskById('fstab');
  if (!fstabTask) {
    logger.info('unable to fetch from external. no fstab task scheduled.');
    return;
  }

  try {
    const res = await fstabTask;
    if (res.status !== 200) {
      logger.info(`unable to fetch fstab.yaml: ${res.status}`);
      return;
    }
    // remember fstab as source
    setdefault(context.content, 'sources', []).push(fstabTask.uri);

    const cfg = await new MountConfig()
      .withSource(res.body)
      .init();

    const idxLastSlash = request.params.path.lastIndexOf('/');
    const idx = request.params.path.indexOf('.', idxLastSlash + 1);
    const resourcePath = decodeURIComponent(request.params.path.substring(0, idx));
    const mp = cfg.match(resourcePath);
    if (!mp) {
      logger.info(`no mount point for ${resourcePath}`);
      return;
    }

    const url = new URL('https://adobeioruntime.net');
    switch (mp.type) {
      case 'google':
        /* istanbul ignore next */
        if (!mp.id) {
          logger.warn('google docs mountpoint needs id');
          return;
        }
        url.pathname = '/api/v1/web/helix/helix-services/gdocs2md@v1';
        url.searchParams.append('path', mp.relPath);
        url.searchParams.append('rootId', mp.id);
        break;
      case 'onedrive':
        url.pathname = '/api/v1/web/helix/helix-services/word2md@v1';
        url.searchParams.append('path', `${mp.relPath}.docx`);
        url.searchParams.append('shareLink', mp.url);
        break;
      default:
        if (mp.type) {
          /* istanbul ignore next */
          logger.error(`mount point type '${mp.type}' not supported.`);
        } else {
          logger.info(`mount point type not detected for '${mp.url}'.`);
        }
        return;
    }

    // extract some tracing info
    const {
      owner, repo, ref,
    } = request.params;
    const requestId = request.headers['x-request-id']
      || request.headers['x-cdn-request-id']
      || request.headers['x-openwhisk-activation-id']
      || '';
    url.searchParams.append('rid', requestId);
    url.searchParams.append('src', `${owner}/${repo}/${ref}`);

    const resp = await downloader.fetch({
      uri: url.href,
      // ump the timeout a bit, since the external script might take a while to render
      options: {
        timeout: 10000,
      },
      errorOn404: true,
    });

    // store extra source location if present
    const sourceLocation = resp.headers.get('x-source-location') || '';
    const sourceHash = crypto.createHash('sha1').update(sourceLocation).digest('base64').substring(0, 16);
    logger.info(`source-location: ${sourceLocation}`);
    logger.info(`source-hash: ${sourceHash}`);
    context.content.body = resp.body;
    context.content.data = {
      sourceLocation,
      sourceHash,
    };
    // sourceLocation is not an url...either a google drive id or onedrive id.
    // but the schema mandates an URI.... the 2md services should probably also provide a stable
    // external uri.
    context.content.sources.push(url.href);
  } catch (err) {
    // throw error if no status error
    /* istanbul ignore next */
    if (!err.status) {
      throw err;
    }
  }
}

module.exports = fetchExternal;
