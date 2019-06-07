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

const Url = require('url-parse');

function scripts(document) {
  document.querySelectorAll('script').forEach((script) => {
    if (script.src) {
      const src = new Url(script.src);
      if (src.host === '' && src.query === '' && src.pathname) {
        // eslint-disable-next-line no-param-reassign
        script.src = `<esi:include src='${src.pathname}.url'/><esi:remove>${script.src}</esi:remove>`;
      }
    }
  });
}

function links(document) {
  document.querySelectorAll('link').forEach((link) => {
    if (link.rel.indexOf('stylesheet') >= 0 && link.href) {
      const href = new Url(link.href);
      if (href.host === '' && href.query === '' && href.pathname) {
        // eslint-disable-next-line no-param-reassign
        link.href = `<esi:include src='${href.pathname}.url'/><esi:remove>${link.href}</esi:remove>`;
      }
    }
  });
}

function rewrite(context) {
  const res = context.response;
  if ((res.headers['Content-Type'] || '').match(/html/) && res.document) {
    links(res.document);
    scripts(res.document);
  }
}

module.exports = rewrite;
