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
const { Pipeline } = require('../../index.js');
const { log } = require('./default.js');

const fetch = require('../html/fetch-markdown.js');
const parse = require('../html/parse-markdown.js');
const meta = require('../html/get-metadata.js');
const html = require('../html/make-html.js');
// const responsive = require('../html/responsify-images.js');
const type = require('../utils/set-content-type.js');
const selectStatus = require('../html/set-status.js');
const smartypants = require('../html/smartypants');
const sections = require('../html/split-sections');
const { selectstrain, selecttest } = require('../utils/conditional-sections');
const debug = require('../html/output-debug.js');
const { esi, flag } = require('../html/flag-esi');
const key = require('../html/set-surrogate-key');
const production = require('../utils/is-production');
const dump = require('../utils/dump-context.js');
const validate = require('../utils/validate');
const { cache, uncached } = require('../html/shared-cache');
const embeds = require('../html/find-embeds');
const parseFrontmatter = require('../html/parse-frontmatter');
const rewriteLinks = require('../html/static-asset-links');
const tovdom = require('../html/html-to-vdom');
const tohtml = require('../html/stringify-response');
const addHeaders = require('../html/add-headers');
const timing = require('../utils/timing');
const sanitize = require('../html/sanitize');

/* eslint newline-per-chained-call: off */

function hascontent({ content }) {
  return !(content !== undefined && content.body !== undefined);
}

function paranoid(context, action) {
  return action && action.secrets && !!action.secrets.HLX_SANITIZE_DOM;
}

const htmlpipe = (cont, context, action) => {
  action.logger = action.logger || log;
  action.logger.log('debug', 'Constructing HTML Pipeline');
  const pipe = new Pipeline(action);
  const timer = timing();
  pipe
    .every(dump).when(() => !production())
    .every(validate).when(() => !production())
    .every(timer.update)
    .before(fetch).expose('fetch').when(hascontent)
    .before(parse).expose('parse')
    .before(parseFrontmatter)
    .before(embeds)
    .before(smartypants)
    .before(sections)
    .before(meta).expose('meta')
    .before(selectstrain)
    .before(selecttest)
    .before(html).expose('html')
    // todo: responsive used to operate on the htast, therefore ignored if content.document was used
    // todo: there is similar logic in the image-handler during jsdom creation....
    // .before(responsive)
    .before(sanitize).when(paranoid)
    .once(cont)
    .after(type('text/html'))
    .after(cache).when(uncached)
    .after(key)
    .after(tovdom).expose('post') // start HTML post-processing
    .after(rewriteLinks).when(production)
    .after(addHeaders)
    .after(tohtml) // end HTML post-processing
    .after(flag).expose('esi').when(esi) // flag ESI when there is ESI in the response
    .after(debug)
    .after(timer.report)
    .error(selectStatus);

  action.logger.log('debug', 'Running HTML pipeline');
  return pipe.run(context);
};

module.exports.pipe = htmlpipe;
