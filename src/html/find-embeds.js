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
import { visit, SKIP, CONTINUE } from 'unist-util-visit';
import { parse, resolve, serialize } from 'uri-js';
import mm from 'micromatch';
import p from 'path';

/**
 * Finds embeds like `video: https://www.youtube.com/embed/2Xc9gXyf2G4`
 * @param {*} text
 */
function gatsbyEmbed(text) {
  const matches = /^[a-z]+: +(http.*)$/.exec(text);
  if (matches && parse(matches[1]).reference === 'absolute') {
    return parse(matches[1]);
  }
  return false;
}

export function internalGatsbyEmbed(text, base, contentext, resourceext) {
  const matches = new RegExp(`^(markdown|html|embed): ?(.*(${contentext}|${resourceext}))$`)
    .exec(text);
  if (matches && matches[2]) {
    const uri = parse(resolve(base, matches[2]));
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
    && parse(children[0].url).reference === 'absolute') {
    return parse(children[0].url);
  }
  return false;
}

export function internalIaEmbed({ type, children }, base, contentext, resourceext) {
  if (type === 'paragraph'
    && children.length === 1
    && children[0].type === 'text'
    && children[0].value
    && !children[0].value.match(/\n/)
    && !children[0].value.match(/ /)
    && (children[0].value.endsWith(contentext) || (children[0].value.endsWith(resourceext)))
  ) {
    const uri = parse(resolve(base, children[0].value));
    return uri.reference === 'relative' && uri.path ? uri : false;
  }
  return false;
}

function imgEmbed({ type, children }) {
  if (type === 'paragraph'
    && children.length === 1
    && children[0].type === 'image'
    && parse(children[0].url).reference === 'absolute'
    && !parse(children[0].url).path.match(/(jpe?g)|png|gif|webm$/i)) {
    return parse(children[0].url);
  }
  return false;
}

export function internalImgEmbed({ type, children }, base, contentext, resourceext) {
  if (type === 'paragraph'
    && children.length === 1
    && children[0].type === 'image'
    && parse(children[0].url).reference === 'relative'
    && (children[0].url.endsWith(contentext) || (children[0].url.endsWith(resourceext)))) {
    const uri = parse(resolve(base, children[0].url));
    return uri.reference === 'relative' && uri.path ? uri : false;
  }
  return false;
}

// eslint-disable-next-line default-param-last
function embed(uri, node, allowlist = [], dataAllowlist = [], logger) {
  if ((uri.scheme === 'http' || uri.scheme === 'https') && mm.some(uri.host, dataAllowlist)) {
    const children = [{ ...node }];
    node.type = 'dataEmbed';
    node.children = children;
    node.url = serialize(uri);
    delete node.value;
    return SKIP;
  }

  if ((uri.scheme === 'http' || uri.scheme === 'https') && mm.some(uri.host, allowlist)) {
    const children = [{ ...node }];
    node.type = 'embed';
    node.children = children;
    node.url = serialize(uri);
    delete node.value;
    return SKIP;
  }

  logger.debug(`Allowlist forbids embedding of URL: ${serialize(uri)}`);
  return CONTINUE;
}

function internalembed(uri, node, extension) {
  const children = [{ ...node }];
  node.type = 'embed';
  node.children = children;
  node.url = p.resolve(p.dirname(uri.path), p.basename(uri.path, p.extname(uri.path)) + extension);
  delete node.value;
  return SKIP;
}

export default function find(
  { content: { mdast }, request: { extension, url } },
  {
    logger, secrets: {
      EMBED_ALLOWLIST,
      EMBED_SELECTOR,
      DATA_EMBED_ALLOWLIST,
    },
    request: { params: { path } },
  },
) {
  const resourceext = `.${extension}`;
  const embedAllowlist = EMBED_ALLOWLIST.split(',').map((s) => s.trim());
  const dataEmbedAllowlist = DATA_EMBED_ALLOWLIST.split(',').map((s) => s.trim());
  const contentext = p.extname(path);
  visit(mdast, (node, _, parent) => {
    if (node.type === 'inlineCode' && gatsbyEmbed(node.value)) {
      return embed(gatsbyEmbed(node.value), node, embedAllowlist, dataEmbedAllowlist, logger);
    }
    if (node.type === 'paragraph' && iaEmbed(node, parent)) {
      return embed(iaEmbed(node, parent), node, embedAllowlist, dataEmbedAllowlist, logger);
    }
    if (node.type === 'paragraph' && imgEmbed(node)) {
      return embed(imgEmbed(node), node, embedAllowlist, dataEmbedAllowlist, logger);
    }
    if (node.type === 'inlineCode' && internalGatsbyEmbed(node.value, url, contentext, resourceext)) {
      return internalembed(internalGatsbyEmbed(node.value, url, contentext, resourceext), node, `.${EMBED_SELECTOR}.${extension}`);
    }
    if (node.type === 'paragraph' && internalIaEmbed(node, url, contentext, resourceext)) {
      return internalembed(internalIaEmbed(node, url, contentext, resourceext), node, `.${EMBED_SELECTOR}.${extension}`);
    }
    if (node.type === 'paragraph' && internalImgEmbed(node, url, contentext, resourceext)) {
      return internalembed(internalImgEmbed(node, url, contentext, resourceext), node, `.${EMBED_SELECTOR}.${extension}`);
    }
    return CONTINUE;
  });
}
