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

const { selectAll } = require('hast-util-select');

function addHeaders({ response: { headers, hast } }) {
  const linkheaders = selectAll('link[rel][href]', hast).reduce((h, { properties: { href, rel } }) => {
    if (!href.match(/<esi:include/)) {
      // eslint-disable-next-line no-param-reassign
      h.Link = `${h.Link ? `${h.Link},` : ''
      }<${href}>; rel="${rel}"`;
    }
    return h;
  }, headers);

  const metaheaders = selectAll('meta[http-equiv][content]', hast).reduce((h, { properties: { httpEquiv, content } }) => {
    const name = httpEquiv;
    const value = content;
    if (!h[name]) {
      // eslint-disable-next-line no-param-reassign
      h[name] = value;
    }
    return h;
  }, linkheaders);

  return {
    response: {
      headers: metaheaders,
    },
  };
}

module.exports = addHeaders;
