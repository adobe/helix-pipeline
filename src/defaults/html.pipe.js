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
const unwrapSoleImages = require('../html/unwrap-sole-images');
const rewriteLinks = require('../html/static-asset-links');
const tovdom = require('../html/html-to-vdom');
const tohtml = require('../html/stringify-response');
const addHeaders = require('../html/add-headers');
const timing = require('../utils/timing');
const sanitize = require('../html/sanitize');
const removeHlxProps = require('../html/removeHlxProps');
const resolveRef = require('../utils/resolve-ref');

/* eslint newline-per-chained-call: off */

function hascontent({ content }) {
  return !(content !== undefined && content.body !== undefined);
}

function paranoid(context, action) {
  return action && action.secrets && !!action.secrets.SANITIZE_DOM;
}

const htmlpipe = (cont, context, action) => {
  action.logger = action.logger || log;
  action.logger.log('debug', 'Constructing HTML Pipeline');
  const pipe = new Pipeline(action);
  const timer = timing();
  pipe
    .every(dump.record)
    .every(validate).when(ctx => !production() && !ctx.error)
    .every(timer.update)
    .use(resolveRef).expose('resolve').when(hascontent)
    .use(fetch).expose('fetch').when(hascontent)
    .use(parse).expose('parse')
    .use(parseFrontmatter)
    .use(embeds)
    .use(smartypants)
    .use(sections)
    .use(meta).expose('meta')
    .use(unwrapSoleImages)
    .use(selectstrain)
    .use(selecttest)
    .use(html).expose('html')
    .use(sanitize).when(paranoid)
    .use(cont)
    .use(type('text/html'))
    .use(cache).when(uncached)
    .use(key)
    .use(tovdom).expose('post') // start HTML post-processing
    .use(removeHlxProps).when(() => production())
    .use(rewriteLinks).when(production)
    .use(addHeaders)
    .use(tohtml) // end HTML post-processing
    .use(flag).expose('esi').when(esi) // flag ESI when there is ESI in the response
    .use(debug)
    .use(timer.report)
    .error(dump.report)
    .error(selectStatus);

  action.logger.log('debug', 'Running HTML pipeline');
  return pipe.run(context);
};

module.exports.pipe = htmlpipe;
