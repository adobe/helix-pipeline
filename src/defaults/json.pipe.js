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
import timing from '../utils/timing.js';
import { selectStatus } from '../json/set-json-status.js';
import emit from '../json/emit-json.js';
import validate from '../html/validate.js';
import { record, report } from '../html/dump-context.js';
import production from '../utils/is-production.js';
import sections from '../html/split-sections.js';
import smartypants from '../html/smartypants.js';
import type from '../html/set-content-type.js';
import meta from '../html/get-metadata.js';
import parse from '../html/parse-markdown.js';
import fetchContent from '../html/fetch-content.js';
import fetch from '../html/fetch-markdown.js';
import { log } from './default.js';

/* eslint newline-per-chained-call: off */

function hasNoContent({ content }) {
  return !(content !== undefined && content.body !== undefined);
}

export function pipe(cont, context, action) {
  action.logger = action.logger || log;
  action.logger.debug('Constructing JSON Pipeline');
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
    .use(emit).expose('json')
    .use(type('application/json'))
    .use(timer.report)
    .error(report)
    .error(selectStatus(production()));

  action.logger.debug('Running JSON pipeline');
  return pipeline.run(context);
}
