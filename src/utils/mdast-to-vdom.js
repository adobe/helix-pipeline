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

/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
const select = require('unist-util-select');
const handlers = require('mdast-util-to-hast/lib/handlers');
const tohast = require('mdast-util-to-hast');
const unified = require('unified');
const parse = require('rehype-parse');
const tohyper = require('hast-to-hyperscript');
const h = require('hyperscript');
const { JSDOM } = require('jsdom');

/**
 *
 * @param {Node} mdast a Markdown AST node
 */
class VDOMTransformer {
  constructor(mdast) {
    this._matchers = [];
    this._root = mdast;
    // go over all handlers that have been defined

    this._handlers = {};
    const that = this;
    Object.keys(handlers)
      // use our own handle function
      .map((type) => {
        this._handlers[type] = (cb, node, parent) => VDOMTransformer.handle(cb, node, parent, that);
        return true;
      });
  }

  static toHTAST(htmlstr, cb, node) {
    // we parse the string to HTAST
    const htast = unified().use(parse, { fragment: true }).parse(htmlstr);
    /* h(node, tagName, props, children) */
    if (htast.children.length === 1) {
      const child = htast.children[0];
      return cb(node, child.tagName, child.properties, child.children);
    }
    return cb(node, 'div', {}, htast.children);
  }

  static handle(cb, node, parent, that) {
    // get the function that handles this node type
    // this will fall back to the default if none matches
    const handlefn = that.matches(node);

    // process the node
    const result = handlefn(cb, node, parent);

    if (result && typeof result === 'string') {
      return VDOMTransformer.toHTAST(result, cb, node);
    } if (result && typeof result === 'object' && result.outerHTML) {
      return VDOMTransformer.toHTAST(result.outerHTML, cb, node);
    }
    return result;
  }

  static default(node) {
    // use the default handler from mdast-util-to-hast
    return handlers[node.type];
  }

  match(matcher, processor) {
    const matchfn = typeof matcher === 'function' ? matcher : VDOMTransformer.matchfn(this._root, matcher);

    this._matchers.push([matchfn, processor]);
  }

  matches(node) {
    // go through all matchers to find processors where matchfn matches
    const processors = this._matchers
      .filter(([matchfn, processor]) => {
        if (matchfn(node)) {
          return processor;
        }
        return false;
      })
      .map(([_, processor]) => processor);
    // add the fallback processors
    processors.push(VDOMTransformer.default(node));
    // return the first processor that matches
    return processors[0];
  }

  static matchfn(ast, pattern) {
    // get all nodes that match the pattern
    const matches = select(ast, pattern);
    return function match(node) {
      // return true if the given node is in the found set
      return matches.indexOf(node) >= 0;
    };
  }

  process() {
    // turn MDAST to HTAST and then HTAST to VDOM via Hyperscript
    return tohyper(h, tohast(this._root, { handlers: this._handlers }));
  }

  getDocument() {
    return new JSDOM(this.process().outerHTML).window.document;
  }
}

module.exports = VDOMTransformer;
