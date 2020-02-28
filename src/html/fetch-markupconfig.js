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
const { setdefault } = require('ferrum');
const { MarkupConfig } = require('@adobe/helix-shared');

async function fetchMarkupConfig(context, action) {
  const { request, downloader } = action;

  const {
    owner, repo, branch, ref,
  } = request.params || {};
  const path = '/helix-markup.yaml';

  // ignore markup config for non-github content
  if (!owner || !repo) {
    return;
  }

  try {
    // schedule fetch task
    const res = await downloader.fetchGithub({
      owner,
      repo,
      ref,
      path,
    });

    if (res.status === 404) {
      return;
    }

    setdefault(context.content, 'sources', []).push(downloader.computeGithubURI(owner, repo, branch || ref || 'master', path));

    const cfg = await new MarkupConfig()
      .withSource(res.body)
      .init();
    const json = cfg.toJSON();
    // TODO: Clean up `name` keys. Remove once @adobe/helix-shared#248 is fixed
    Object.values(json.markup).forEach((c) => delete c.name);
    setdefault(action, 'markupconfig', json);
  } catch (err) {
    // throw error if no status error
    /* istanbul ignore next */
    if (!err.status) {
      throw err;
    }
  }
}

module.exports = fetchMarkupConfig;
