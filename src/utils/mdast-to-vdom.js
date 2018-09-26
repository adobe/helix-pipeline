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
const image = require('./image-handler');

/**
 * @typedef {function(parent, tagname, attributes, children)} handlerFunction
 * @param parent {Node} the root node to append the new dom node to
 * @param tagname {string} name of the new tag
 * @param attributes {object} HTML attributes as key-value pairs
 * @param children {Node[]} list of children
 */

/**
 * Utility class that transforms an MDAST (Markdown) node into a (virtual) DOM
 * representation of the same content.
 */
class VDOMTransformer {
  /**
   * Initializes the transformer with a Markdown document or fragment of a document
   * @param {Node} mdast the markdown AST node to start the transformation from.
   * @param {object} options options for custom transformers
   */
  constructor(mdast, options) {
    this._matchers = [
      ['image', image(options)],
    ];
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

  /**
   * Turns a string of HTML into proper HTAST nodes, using a given root (HTAST) node
   * and a callback function that constructs the HTAST nodes
   * @private
   * @param {string} htmlstr the HTML to convert
   * @param {handlerFunction} cb the DOM building function
   * @param {Node} node parent node to attach new nodes to
   * @returns {Node} the new DOM node
   */
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

  /**
   * An mdast-util-to-hast handler function that applies matchers and
   * falls back to the default mdast-util-to-hast handlers if no matchers
   * apply
   * @private
   * @param {handlerFunction} cb
   * @param {Node} node the MDAST node to transofrm
   * @param {Node} parent the MDAST parent or root node for select expressions
   * @param {VDOMTransformer} that the MDAST to VDOM transformer
   * @returns {Node} a HTAST representation of the `node` input
   */
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

  /**
   * Returns the default handler for a given node type
   * @param {Node} node an MDAST node
   * @returns {handlerFunction} the default handler function
   */
  static default(node) {
    // use the default handler from mdast-util-to-hast
    return handlers[node.type];
  }

  /**
   * A predicate function that filters MDAST nodes
   * @typedef {function(node)} matcherFunction
   * @param {Node} node an MDAST node
   * @returns {boolean} true for matching nodes
   */

  /**
   * Registers a handler function for nodes that match either a select expression
   * or a matcher predicate function. The `matcher` will be evaluated against every
   * node in the MDAST. In cases where the `matcher` matches (returns true), the
   * processor will be called with the current node.
   * @param {(string|matcherFunction)} matcher either an unist-util-select expression
   * or a predicate function
   * @param {handlerFunction} processor the appropriate handler function to handle matching types.
   * @returns {VDOMTransformer} this, enabling chaining
   */
  match(matcher, processor) {
    const matchfn = typeof matcher === 'function' ? matcher : VDOMTransformer.matchfn(this._root, matcher);

    this._matchers.push([matchfn, processor]);

    return this;
  }

  /**
   * Finds an appropriate handler for a given MDAST node
   * @private
   * @param {Node} node an MDAST node
   * @returns {handlerFunction} a handler function to process the node with
   */
  matches(node) {
    // go through all matchers to find processors where matchfn matches
    // start with most recently added processors
    const processors = this._matchers.slice(0).reverse()
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

  /**
   * Turns an unist-util-select expression into a matcher predicate function
   * @private
   * @param {Node} ast the MDAST root node to evaluated expressions against
   * @param {string} pattern a CSS-like unist-util-select expression
   * @returns {matcherFunction} a corresponding matcher function that returns true
   * for nodes matching the pattern
   */
  static matchfn(ast, pattern) {
    // get all nodes that match the pattern
    const matches = select(ast, pattern);
    return function match(node) {
      // return true if the given node is in the found set
      return matches.indexOf(node) >= 0;
    };
  }

  /**
   * Turns the MDAST into a basic DOM-like structure using Hyperscript
   * @returns {Node} a simple DOM node (not all DOM functions exposed)
   */
  process() {
    // turn MDAST to HTAST and then HTAST to VDOM via Hyperscript
    return tohyper(h, tohast(this._root, { handlers: this._handlers }));
  }

  /**
   * Turns the MDAST into a full DOM-like structure using JSDOM
   * @returns {Node} a full DOM node
   */
  getDocument() {
    return new JSDOM(this.process().outerHTML).window.document;
  }
}

module.exports = VDOMTransformer;
