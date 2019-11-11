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

function addHeaders({ response: { headers, document } }) {
  const linkHeader = [];
  document.querySelectorAll('link').forEach(({ href, rel, as }) => {
    if (href && rel && !href.match(/<esi:include/)) {
      if (as && rel.indexOf('preload' > -1)) {
        // https://www.w3.org/TR/preload/#as-attribute
        linkHeader.push(`<${href}>; rel="${rel}"; as="${as}"`);
      } else {
        linkHeader.push(`<${href}>; rel="${rel}"`);
      }
    }
  });
  document.querySelectorAll('meta').forEach(({ httpEquiv, content }) => {
    if (httpEquiv === 'Link') {
      linkHeader.push(content);
    } else if (httpEquiv && content && !headers[httpEquiv]) {
      headers[httpEquiv] = content;
    }
  });

  if (linkHeader.length > 0) {
    headers.Link = linkHeader.join();
  }
}

module.exports = addHeaders;
