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
const { before, after, log } = require('./default.js');

module.exports.pipe = function (cont, params, secrets, logger = log) {
  logger.log('debug', 'Constructing HTML Pipeline');
  const pipe = pipeline()
    .pre(before)
    .pre(require('../html/fetch-markdown.js')(secrets))
    .pre(require('../html/parse-markdown.js'))
    .pre(require('../html/get-metadata.js'))
    .pre(require('../html/make-html.js'))
  // we could pass different resolutions here.
    .pre(require('../html/responsify-images.js')())
    .pre(require('../html/emit-html.js'))
    .once(cont)
    .post(require('../html/set-content-type.js'))
    .post(after);

  return pipe;
};
