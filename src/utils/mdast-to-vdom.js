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
const { JSDOM } = require('jsdom');
const toDOM = require('./hast-util-to-dom');
const HeadingHandler = require('./heading-handler');
const embed = require('./embed-handler');
const link = require('./link-handler');
const section = require('./section-handler');
const types = require('../schemas/mdast.schema.json').properties.type.enum;

/**
 * @typedef {function(parent, tagName, attributes, children)} handlerFunction
 * @param {Node} parent the root node to append the new dom node to
 * @param {string} tagName name of the new tag
 * @param {object} attributes HTML attributes as key-value pairs
 * @param {Node[]} children list of children
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
    this.match('embed', embed(options));
    this.match('link', link(options));
    this.match('section', section(options));
    this.match('html', (h, node) => {
      if (node.value.startsWith('<!--')) {
        return h.augment(node, {
          type: 'comment',
          value: node.value.substring(4, node.value.length - 3),
        });
      }
      this._hasRaw = true;
      const frag = JSDOM.fragment(node.value);
      return h.augment(node, {
        type: 'raw',
        value: frag,
        html: node.value,
      });
    });
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
      throw new Error('returning string from a handler is not supported yet.');
    } else if (result && typeof result === 'object' && result.outerHTML) {
      throw new Error('returning a DOM element from a handler is not supported yet.');
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
    for (let i = this._matchers.length - 1; i >= 0; i -= 1) {
      const [matchfn, processor] = this._matchers[i];
      if (matchfn(node)) {
        // return the first processor that matches
        return processor;
      }
    }
    // add the fallback processors
    return VDOMTransformer.default(node);
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
   * Tries to sanitize inline HTML elements. The remark parser creates `raw` nodes for html.
   * In case of inline html, those are not closed elements. since we generated the DOM already
   * in the HTML handler, we get incomplete fragments, missing the inner HTML. This method tries
   * to fix this. It doesn't support inner markdown-elements, though.
   *
   * @param {object} node HAST node
   */
  static sanitizeInlineHTML(node) {
    const stack = [];
    for (let i = 0; i < node.children.length; i += 1) {
      const child = node.children[i];
      if (child.type === 'raw') {
        if (child.value.firstElementChild === null) {
          if (stack.length === 0) {
            throw new Error(`no matching inline element found for ${child.html}`);
          } else {
            const last = stack.pop();
            let html = '';
            for (let j = last; j <= i; j += 1) {
              html += node.children[j].html || node.children[j].value;
            }
            node.children[last].value = JSDOM.fragment(html);
            node.children[last].html = html;
            node.children.splice(last + 1, i - last);
            i = last;
          }
        } else {
          stack.push(i);
        }
      } else if (child.children && child.children.length) {
        VDOMTransformer.sanitizeInlineHTML(child);
      }
    }
  }

  /**
   * Turns the MDAST into a full DOM-like structure using JSDOM
   * @returns {Document} a full DOM document
   */
  getDocument() {
    // mdast -> hast; hast -> DOM using JSDOM
    const hast = mdast2hast(this._root, {
      handlers: this._handlers,
      allowDangerousHTML: true,
    });

    if (this._hasRaw) {
      VDOMTransformer.sanitizeInlineHTML(hast);
    }

    const dom = new JSDOM();
    const doc = dom.window.document;
    const frag = toDOM(doc, hast, { fragment: true });

    if (frag.nodeName === '#document') {
      // this only happens if it's an empty markdown document, so just ignore
    } else {
      doc.body.appendChild(frag);
    }

    // add convenience function to serialize entire document. this is to make it similar to the
    // document created in html-to-vdom.
    doc.serialize = dom.serialize.bind(dom);

    // this is a bit a hack to pass the JSDOM instance along, so that other module can use it.
    // this ensures that other modules can parse documents and fragments that are compatible
    // with this document
    doc.JSDOM = JSDOM;
    return doc;
  }
}

module.exports = VDOMTransformer;
