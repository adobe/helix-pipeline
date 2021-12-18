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
import { Pipeline } from '../../index.js';
import { log } from './default.js';

import fetch from '../html/fetch-markdown.js';
import fetchContent from '../html/fetch-content.js';
import fetchMarkupConfig from '../html/fetch-markupconfig.js';
import parse from '../html/parse-markdown.js';
import rewriteBlobImages from '../html/rewrite-blob-images.js';
import rewriteIcons from '../html/rewrite-icons.js';
import meta from '../html/get-metadata.js';
import html from '../html/make-html.js';
import type from '../html/set-content-type.js';
import selectStatus from '../html/set-status.js';
import smartypants from '../html/smartypants.js';
import sections from '../html/split-sections.js';
import { selectstrain, selecttest } from '../html/conditional-sections.js';
import debug from '../html/output-debug.js';
import { esi, flag } from '../html/flag-esi.js';
import { adjustHTML, adjustMDAST } from '../html/adjust-markup.js';
import dataSections from '../html/data-sections.js';
import dataEmbeds from '../html/fetch-data.js';
import removeHlxProps from '../html/removeHlxProps.js';
import sanitize from '../html/sanitize.js';
import timing from '../utils/timing.js';
import tohtml from '../html/stringify-response.js';
import tovdom from '../html/html-to-vdom.js';
import rewriteLinks from '../html/static-asset-links.js';
import unwrapSoleImages from '../html/unwrap-sole-images.js';
import embeds from '../html/find-embeds.js';
import { cache, uncached } from '../html/shared-cache.js';
import validate from '../html/validate.js';
import { record, report } from '../html/dump-context.js';
import production from '../utils/is-production.js';
import lastModified from '../html/set-last-modified.js';
import key from '../html/set-surrogate-key.js';

/* eslint newline-per-chained-call: off */

function hasNoContent({ content }) {
  return !(content !== undefined && content.body !== undefined);
}

function paranoid(context, action) {
  return action && action.secrets && !!action.secrets.SANITIZE_DOM;
}

export function pipe(cont, context, action) {
  action.logger = action.logger || log;
  action.logger.debug('Constructing HTML Pipeline');
  const pipeline = new Pipeline(action);
  const timer = timing();
  pipeline
    .every(record)
    .every(validate).when((ctx) => !production() && !ctx.error)
    .every(timer.update)
    .use(fetchMarkupConfig)
    .use(fetchContent).expose('content').when(hasNoContent)
    .use(fetch).expose('fetch').when(hasNoContent)
    .use(parse).expose('parse')
    .use(embeds)
    .use(dataEmbeds)
    .use(smartypants)
    .use(sections)
    .use(meta).expose('meta')
    .use(unwrapSoleImages)
    .use(adjustMDAST)
    .use(selectstrain)
    .use(selecttest)
    .use(dataSections)
    .use(html).expose('html')
    .use(rewriteBlobImages)
    .use(rewriteIcons)
    .use(adjustHTML)
    .use(sanitize).when(paranoid)
    .use(cont)
    .use(type('text/html'))
    .use(cache).when(uncached)
    .use(key)
    .use(lastModified)
    .use(tovdom).expose('post') // start HTML post-processing
    .use(removeHlxProps).expose('cleanup')
    .use(rewriteLinks).when(production)
    .use(tohtml) // end HTML post-processing
    .use(flag).expose('esi').when(esi) // flag ESI when there is ESI in the response
    .use(debug)
    .use(timer.report)
    .error(report)
    .error(selectStatus);

  action.logger.debug('Running HTML pipeline');
  return pipeline.run(context);
}
