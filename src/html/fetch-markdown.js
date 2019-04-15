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
const { iter } = require('@adobe/helix-shared').sequence;
const { bail } = require('../helper');
const { normalizeURL } = require('../utils/util');

/**
 * Stage of the markdown->html pipeline that actually fetches the content.
 *
 * @param {import("../context").Context} ctx
 * @param {import("../context").Action} action
 */
const fetch = async ({ content = [] }, { request, logger }) => {
  const { sources = [] } = content;

  logger.info(`A`);
  if (!request || !request.params) {
    return bail(logger, 'Request parameters are missing');
  }

  const { owner, repo, path } = request.params;
  const ref = request.params.ref || 'refs/heads/master';
  const dump = (o) => require('util').inspect(o, {depth: null});

  logger.info(`B ${dump(request)}`);
  logger.info(`X ${dump({owner, repo, path, ref})}`);
  // for (const [key, val] of iter({ owner, repo, path })) {
  //   if (!val) {
  //     return bail(logger, `Unknown ${key}, cannot fetch content.`);
  //   }
  // }

  logger.info(`C`);
  const opt = {
    url: normalizeURL(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`),
    qs: { ref },
    headers: {
      Accept: 'application/vnd.github.VERSION.raw"',
      'User-Agent': 'project-helix'
    },
    timeout: 1000,
    time: true,
  };

  logger.debug(`Fetching Markdown from ${opt.url}`);
  const response = await client(opt);

  return {
    content: {
      body: response,
      sources: [...sources, opt.url],
    },
  };
};

module.exports = fetch;
