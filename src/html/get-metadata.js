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
const select = require('unist-util-select');
const plain = require('mdast-util-to-string');
const yaml = require('yaml');


const getmetadata = ({ resource: { mdast } }) => {
  const retresource = {};

  const yamls = select(mdast, 'yaml'); // select all YAML nodes
  const mapped = yamls.map(({ value }) => yaml.eval(value));
  const meta = Object.assign(...mapped);
  retresource.meta = meta;

  const headers = select(mdast, 'heading');
  if (headers[0]) {
    retresource.title = plain(headers[0]);
    retresource.intro = plain(headers[0]);
  }

  const paragraphs = select(mdast, 'paragraph');
  if (paragraphs[0]) {
    if (!headers[0]) {
      retresource.title = plain(paragraphs[0]);
    }
    retresource.intro = plain(paragraphs[0]);
  }

  return { resource: retresource };
};

module.exports = getmetadata;
