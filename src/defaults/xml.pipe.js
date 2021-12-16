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
import parse from '../html/parse-markdown.js';
import meta from '../html/get-metadata.js';
import { esi, flag } from '../html/flag-esi.js';
import smartypants from '../html/smartypants.js';
import sections from '../html/split-sections.js';
import { cache, uncached } from '../html/shared-cache.js';
import timing from '../utils/timing.js';
import check from '../xml/check-xml.js';
import selectStatus from '../xml/set-xml-status.js';
import emit from '../xml/emit-xml.js';
import type from '../utils/set-content-type.js';
import validate from '../utils/validate.js';
import { record, report } from '../utils/dump-context.js';
import production from '../utils/is-production.js';
import key from '../html/set-surrogate-key.js';

/* eslint newline-per-chained-call: off */

function hasNoContent({ content }) {
  return !(content !== undefined && content.body !== undefined);
}

export function pipe(cont, context, action) {
  action.logger = action.logger || log;
  action.logger.debug('Constructing XML Pipeline');
  const pipeline = new Pipeline(action);
  const timer = timing();
  pipeline
    .every(record)
    .every(validate).when((ctx) => !production() && !ctx.error)
    .every(timer.update)
    .use(fetchContent).expose('content').when(hasNoContent)
    .use(fetch).expose('fetch').when(hasNoContent)
    .use(parse).expose('parse')
    .use(smartypants)
    .use(sections)
    .use(meta).expose('meta')
    .use(cont)
    .use(emit).expose('xml')
    .use(type('application/xml'))
    .use(check)
    .use(cache).when(uncached)
    .use(key)
    .use(flag).expose('esi').when(esi) // flag ESI when there is ESI in the response
    .use(timer.report)
    .error(report)
    .error(selectStatus);

  action.logger.debug('Running XML pipeline');
  return pipeline.run(context);
}
