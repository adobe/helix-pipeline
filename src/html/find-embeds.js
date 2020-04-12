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
const map = require('unist-util-map');
const URI = require('uri-js');
const mm = require('micromatch');
const p = require('path');

/**
 * Finds embeds like `video: https://www.youtube.com/embed/2Xc9gXyf2G4`
 * @param {*} text
 */
function gatsbyEmbed(text) {
  const matches = /^[a-z]+: +(http.*)$/.exec(text);
  if (matches && URI.parse(matches[1]).reference === 'absolute') {
    return URI.parse(matches[1]);
  }
  return false;
}

function internalGatsbyEmbed(text, base, contentext, resourceext) {
  const matches = new RegExp(`^(markdown|html|embed): ?(.*(${contentext}|${resourceext}))$`)
    .exec(text);
  if (matches && matches[2]) {
    const uri = URI.parse(URI.resolve(base, matches[2]));
    return uri.reference === 'relative' && uri.path ? uri : false;
  }
  return false;
}

/**
 * Finds embeds that are single absolute links in a paragraph
 * @param {*} node An MDAST node
 */
function iaEmbed({ type, children }, parent) {
  if (type === 'paragraph'
    && children.length === 1
    && children[0].type === 'link'
    && (parent.type === 'root' || parent.type === 'section') // only direct children
    && children[0].children.length === 1
    && (children[0].children[0].type === 'image' || children[0].children[0].value === children[0].url) // no other link text
    && URI.parse(children[0].url).reference === 'absolute') {
    return URI.parse(children[0].url);
  }
  return false;
}

function internalIaEmbed({ type, children }, base, contentext, resourceext) {
  if (type === 'paragraph'
    && children.length === 1
    && children[0].type === 'text'
    && children[0].value
    && !children[0].value.match(/\n/)
    && !children[0].value.match(/ /)
    && (children[0].value.endsWith(contentext) || (children[0].value.endsWith(resourceext)))
  ) {
    const uri = URI.parse(URI.resolve(base, children[0].value));
    return uri.reference === 'relative' && uri.path ? uri : false;
  }
  return false;
}

function imgEmbed({ type, children }) {
  if (type === 'paragraph'
    && children.length === 1
    && children[0].type === 'image'
    && URI.parse(children[0].url).reference === 'absolute'
    && !URI.parse(children[0].url).path.match(/(jpe?g)|png|gif|webm$/i)) {
    return URI.parse(children[0].url);
  }
  return false;
}

function internalImgEmbed({ type, children }, base, contentext, resourceext) {
  if (type === 'paragraph'
    && children.length === 1
    && children[0].type === 'image'
    && URI.parse(children[0].url).reference === 'relative'
    && (children[0].url.endsWith(contentext) || (children[0].url.endsWith(resourceext)))) {
    const uri = URI.parse(URI.resolve(base, children[0].url));
    return uri.reference === 'relative' && uri.path ? uri : false;
  }
  return false;
}

function embed(uri, node, whitelist = '', datawhitelist = '', logger) {
  if ((uri.scheme === 'http' || uri.scheme === 'https') && mm.some(uri.host, datawhitelist.split(', '))) {
    const children = [{ ...node }];
    node.type = 'dataEmbed';
    node.children = children;
    node.url = URI.serialize(uri);
    delete node.value;
  } else if ((uri.scheme === 'http' || uri.scheme === 'https') && mm.some(uri.host, whitelist.split(', '))) {
    const children = [{ ...node }];
    node.type = 'embed';
    node.children = children;
    node.url = URI.serialize(uri);
    if (node.value) {
      delete node.value;
    }
  } else {
    logger.debug(`Whitelist forbids embedding of URL: ${URI.serialize(uri)}`);
  }
}

function internalembed(uri, node, extension) {
  const children = [{ ...node }];
  node.type = 'embed';
  node.children = children;
  node.url = p.resolve(p.dirname(uri.path), p.basename(uri.path, p.extname(uri.path)) + extension);
  if (node.value) {
    delete node.value;
  }
}

function find({ content: { mdast }, request: { extension, url } },
  {
    logger, secrets: {
      EMBED_WHITELIST,
      EMBED_SELECTOR,
      DATA_EMBED_WHITELIST,
    },
    request: { params: { path } },
  }) {
  const resourceext = `.${extension}`;
  const contentext = p.extname(path);
  map(mdast, (node, _, parent) => {
    if (node.type === 'inlineCode' && gatsbyEmbed(node.value)) {
      embed(gatsbyEmbed(node.value), node, EMBED_WHITELIST, DATA_EMBED_WHITELIST, logger);
    } else if (node.type === 'paragraph' && iaEmbed(node, parent)) {
      embed(iaEmbed(node, parent), node, EMBED_WHITELIST, DATA_EMBED_WHITELIST, logger);
    } else if (node.type === 'paragraph' && imgEmbed(node)) {
      embed(imgEmbed(node), node, EMBED_WHITELIST, DATA_EMBED_WHITELIST, logger);
    } else if (node.type === 'inlineCode'
      && internalGatsbyEmbed(node.value, url, contentext, resourceext)) {
      internalembed(internalGatsbyEmbed(node.value, url, contentext, resourceext), node, `.${EMBED_SELECTOR}.${extension}`);
    } else if (node.type === 'paragraph'
    && internalIaEmbed(node, url, contentext, resourceext)) {
      internalembed(internalIaEmbed(node, url, contentext, resourceext), node, `.${EMBED_SELECTOR}.${extension}`);
    } else if (node.type === 'paragraph'
  && internalImgEmbed(node, url, contentext, resourceext)) {
      internalembed(internalImgEmbed(node, url, contentext, resourceext), node, `.${EMBED_SELECTOR}.${extension}`);
    }
  });
}

module.exports = find;
module.exports.internalGatsbyEmbed = internalGatsbyEmbed;
module.exports.internalIaEmbed = internalIaEmbed;
module.exports.internalImgEmbed = internalImgEmbed;
