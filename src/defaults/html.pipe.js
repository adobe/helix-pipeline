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
const pipeline = require('../../index.js');
const { adaptOWRequest, adaptOWResponse, log } = require('./default.js');

const fetch = require('../html/fetch-markdown.js');
const parse = require('../html/parse-markdown.js');
const meta = require('../html/get-metadata.js');
const html = require('../html/make-html.js');
const responsive = require('../html/responsify-images.js');
const emit = require('../html/emit-html.js');
const type = require('../html/set-content-type.js');

const htmlpipe = (cont, params, secrets, logger = log) => {
  logger.log('debug', 'Constructing HTML Pipeline');
  const pipe = pipeline()
    .pre(adaptOWRequest())
    .pre(fetch(secrets))
    .pre(parse())
    .pre(meta())
    .pre(html())
    // we could pass different resolutions here.
    .pre(responsive())
    .pre(emit())
    .once(cont)
    .post(type())
    .post(adaptOWResponse());

  return pipe;
};

module.exports.pipe = htmlpipe;
