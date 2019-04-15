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
const { selectAll } = require('unist-util-select');
const defaultHandlers = require('mdast-util-to-hast/lib/handlers');
const mdast2hast = require('mdast-util-to-hast');
const hast2html = require('hast-util-to-html');
const unified = require('unified');
const parse = require('rehype-parse');
const { JSDOM } = require('jsdom');
const HeadingHandler = require('./heading-handler');
const sanitize = require('./sanitize-hast');
const HeadingHandler = require('./heading-handler');
const sanitize = require('./sanitize-hast');
const image = require('./image-handler');
const embed = require('./embed-handler');
const link = require('./link-handler');
const types = require('../schemas/mdast.schema.json').properties.type.enum;

/**
 * @typedef {function(parent, tagname, attributes, children)} handlerFunction
 * @param parent {Node} the root node to append the new dom node to
 * @param tagname {string} name of the new tag
 * @param attributes {object} HTML attributes as key-value pairs
 * @param children {Node[]} list of children
 */
/**
 * @typedef {object} srcsetspec
 * @param {number} from smallest possible size
 * @param {number} to largest possible size
 * @param {number} steps number of steps
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
   * @param {string[]} options.sizes a list of size media queries
   * @param {(number[]|srcsetspec)} a list of image widths to generate
   */
  constructor(mdast, options) {
    this._matchers = [];
    this._root = mdast;
    // go over all handlers that have been defined

    this._handlers = {};
    const that = this;
    // use our own handle function for every known node type
    types.map((type) => {
      this._handlers[type] = (cb, node, parent) => VDOMTransformer.handle(cb, node, parent, that);
      return true;
    });

    this._headingHandler = new HeadingHandler(options);
    this.match('heading', this._headingHandler.handler());
    this.match('image', image(options));
    this.match('embed', embed(options));
    this.match('link', link(options));
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

    /**
     * A function that enables the recursive processing of MDAST child nodes
     * in handler functions.
     * @param {function} callback the HAST-constructing callback function
     * @param {Node} childnode the MDAST child node that should be handled
     * @param {Node} mdastparent the MDAST parent node, usually the current MDAST node
     * processed by the handler function
     * @param {*} hastparent the HAST parent node that the transformed child will be appended to
     */
    function handlechild(callback, childnode, mdastparent, hastparent) {
      if (hastparent && hastparent.children) {
        hastparent.children.push(VDOMTransformer.handle(callback, childnode, mdastparent, that));
      }
    }

    const result = handlefn(cb, node, parent, handlechild);

    if (result && typeof result === 'string') {
      return VDOMTransformer.toHTAST(result, cb, node);
    } else if (result && typeof result === 'object' && result.outerHTML) {
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
    return defaultHandlers[node.type];
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
    const matches = selectAll(pattern, ast);
    return function match(node) {
      // return true if the given node is in the found set
      return matches.indexOf(node) >= 0;
    };
  }

  /**
   * Transfroms an MDAST node into an HTML string. mdast-util-to-hast handlers can be specified.
   * @param {Node} ast the MDAST root node
   * @param {*} handlers the mdast-util-to-hast handlers for the transformation
   * @returns {string} the corresponding HTML
   */
  static toHTML(mdast, handlers) {
    return hast2html(mdast2hast(mdast, {
      handlers,
      allowDangerousHTML: true,
    }), { allowDangerousHTML: true });
  }

  /**
   * Turns the MDAST into a full DOM-like structure using JSDOM
   * @returns {Document} a full DOM document
   */
  getDocument() {
    // mdast -> hast; hast -> html -> DOM using JSDOM
    return new JSDOM(VDOMTransformer.toHTML(this._root, this._handlers)).window.document;
  }

  /**
   * Turns the MDAST into a DOM-node-like structure using JSDOM
   * @param {string} tag the tag of the container node
   * @returns {Node} a DOM node containing the HTML-processed MDAST
   */
  getNode(tag = 'div') {
    // create a JSDOM object with the hast surrounded by the provided tag
    return new JSDOM(`<${tag}>${VDOMTransformer.toHTML(this._root, this._handlers)}</${tag}>`).window.document.body.firstChild;
  }

  /**
   * Resets the transformer to avoid leakages between sequential transformations
   */
  reset() {
    // Reset the heading handler so that id uniqueness is guarateed and reset
    this._headingHandler.reset();
  }
}

module.exports = VDOMTransformer;
