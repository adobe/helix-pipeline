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

const map = require('unist-util-map');
const Url = require('url-parse');

function scripts() {
  return function transformer(tree) {
    map(tree, (node) => {
      if (node.tagName === 'script'
        && node.properties
        && node.properties.src) {
        const src = new Url(node.properties.src);
        if (src.host === '' && src.query === '' && src.pathname) {
          // eslint-disable-next-line no-param-reassign
          node.properties.src = `<esi:include src="${src.pathname}.url"/><esi:remove>${node.properties.src}</esi:remove>`;
        }
      }
    });
  };
}

function links() {
  return function transformer(tree) {
    map(tree, (node) => {
      if (node.tagName === 'link'
        && node.properties
        && node.properties.rel
        && Array.isArray(node.properties.rel)
        && node.properties.rel.indexOf('stylesheet') !== -1
        && node.properties.href) {
        const href = new Url(node.properties.href);
        if (href.host === '' && href.query === '' && href.pathname) {
          // eslint-disable-next-line no-param-reassign
          node.properties.href = `<esi:include src="${href.pathname}.url"/><esi:remove>${node.properties.href}</esi:remove>`;
        }
      }
    });
  };
}

function rewrite(context) {
  const res = context.response;
  if ((res.headers['Content-Type'] || '').match(/html/) && res.hast) {
    links()(res.hast);
    scripts()(res.hast);
  }
}

module.exports = rewrite;
