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
const { selectAll } = require('unist-util-select');
const {
  pipe, map, uniq, list,
} = require('ferrum');

function fetch({ content: { mdast } }, { downloader, secrets: { DATA_EMBED_SERVICE } }) {
  const fetches = pipe(
    selectAll('dataEmbed', mdast),
    map((node) => node.url),
    uniq,
    map((url) => {
      console.log(`fetching ${DATA_EMBED_SERVICE}/${url}`);
      return downloader.fetch({
        uri: `${DATA_EMBED_SERVICE}/${url}`,
        id: `dataEmbed:${url}`,
      });
    }),
  );
  list(fetches);
}

module.exports = fetch;
