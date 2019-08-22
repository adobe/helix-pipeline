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
const { esi, flag } = require('../html/flag-esi');
const smartypants = require('../html/smartypants');
const sections = require('../html/split-sections');
const { cache, uncached } = require('../html/shared-cache');
const key = require('../html/set-surrogate-key');
const production = require('../utils/is-production');
const dump = require('../utils/dump-context.js');
const validate = require('../utils/validate');
const type = require('../utils/set-content-type.js');
const emit = require('../xml/emit-xml.js');
const selectStatus = require('../xml/set-xml-status.js');
const check = require('../xml/check-xml');
const parseFrontmatter = require('../html/parse-frontmatter');
const timing = require('../utils/timing');

/* eslint newline-per-chained-call: off */

const xmlpipe = (cont, context, action) => {
  action.logger = action.logger || log;
  action.logger.log('debug', 'Constructing XML Pipeline');
  const pipe = new Pipeline(action);
  const timer = timing();
  pipe
    .every(dump.record)
    .every(validate).when(() => !production())
    .every(timer.update)
    .use(fetch).expose('fetch')
    .use(parse).expose('parse')
    .use(parseFrontmatter)
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
    .error(dump.report)
    .error(selectStatus);

  action.logger.log('debug', 'Running XML pipeline');
  return pipe.run(context);
};

module.exports.pipe = xmlpipe;
