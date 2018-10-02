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
const { adaptOWRequest, adaptOWResponse, log } = require('./default.js');

const fetch = require('../html/fetch-markdown.js');
const parse = require('../html/parse-markdown.js');
const meta = require('../html/get-metadata.js');
const type = require('../json/set-content-type.js');
const smartypants = require('../html/smartypants');
const sections = require('../html/split-sections');
const production = require('../utils/is-production');
const dump = require('../utils/dump-context.js');

/* eslint no-param-reassign: off */

const htmlpipe = (cont, payload, action) => {
  action.logger = action.logger || log;
  action.logger.log('debug', 'Constructing JSON Pipeline');
  const pipe = new Pipeline(action);
  pipe
    .tap(dump).when(() => !production())
    .pre(adaptOWRequest)
    .pre(fetch)
    .pre(parse)
    .pre(smartypants)
    .pre(sections)
    .pre(meta)
    .once(cont)
    .post(type)
    .post(adaptOWResponse);

  action.logger.log('debug', 'Running JSON pipeline');
  return pipe.run(payload);
};

module.exports.pipe = htmlpipe;
