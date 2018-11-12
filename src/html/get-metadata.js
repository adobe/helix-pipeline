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
const { safeLoad } = require('js-yaml');

function yaml(section) {
  const yamls = select(section, 'yaml'); // select all YAML nodes
  const mapped = yamls.map(({ value }) => safeLoad(value));
  return Object.assign({ meta: Object.assign({}, ...mapped) }, section);
}

function title(section) {
  const header = select(section, 'heading')[0];
  return header ? Object.assign({ title: plain(header) }, section) : section;
}

function intro(section) {
  const para = select(section, 'paragraph')[0];
  return para ? Object.assign({ intro: plain(para) }, section) : section;
}

function image(section) {
  // selects the most prominent image of the section
  // TODO: get a better measure of prominence than "first"
  const img = select(section, 'image')[0];
  return img ? Object.assign({ image: img.url }, section) : section;
}

/**
 * Sets the `types` attribute of the section, using following patterns:
 * 1. has-<type> for every type of content found in the section
 * 2. is-<type>-only for sections that have only content of type
 * 3. is-<type1>-<type2>-<type3> ranks the top three most common types of content
 * @param {*} section
 */
function sectiontype(section) {
  const children = section.children || [];
  const typecounter = children.reduce((counter, { type }) => {
    if (type === 'yaml') {
      return counter;
    }
    const mycounter = {};
    const mycount = counter[type] || 0;
    mycounter[type] = mycount + 1;
    return Object.assign(counter, mycounter);
  }, {});

  const types = Object.keys(typecounter).map(type => `has-${type}`);
  if (Object.keys(typecounter).length === 1) {
    types.push(`is-${Object.keys(typecounter)[0]}-only`);
  } else {
    types.push(...Object.entries(typecounter) // get pairs of type, count
      .sort((left, right) => left[1] < right[1]) // sort descending by count
      .slice(0, 3) // take the top three
      .map(([name]) => name) // keep only the type
      .reduce((names, name) => [`${names[0] || 'is'}-${name}`, ...names], [])); // generate names
  }

  return Object.assign({ types }, section);
}

function fallback(section) {
  if (section.intro && !section.title) {
    return Object.assign({ title: section.intro }, section);
  } if (section.title && !section.intro) {
    return Object.assign({ intro: section.title }, section);
  }
  return section;
}

function getmetadata({ content: { sections = [] } }, { logger }) {
  logger.debug(`Parsing Markdown Metadata from ${sections.length} sections`);

  const retsections = sections
    .map(yaml)
    .map(title)
    .map(intro)
    .map(image)
    .map(sectiontype)
    .map(fallback);
  const img = retsections.filter(section => section.image)[0];
  if (retsections[0]) {
    const retcontent = {
      sections: retsections,
      meta: retsections[0].meta,
      title: retsections[0].title,
      intro: retsections[0].intro,
      image: img ? img.image : undefined,
    };
    return { content: retcontent };
  }
  return { content: { meta: {} } };
}

module.exports = getmetadata;
