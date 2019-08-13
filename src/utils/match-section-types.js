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
const { match } = require('./pattern-compiler');
/**
 * This utility class allows the registration of type matchers. Type matchers
 * are either content-expressions like `header? (image|paragraph)+` or predicate
 * functions that operate on a list of child node types.
 */
class TypeMatcher {
  /**
   * Creates a new type matcher for an MDAST node or list of MDAST nodes
   * @param {(Node|Node[])} section the section node or list of section nodes to evaluate
   * the registered content expressions against.
   */
  constructor(section = []) {
    if (Array.isArray(section)) {
      this._sections = section;
    } else if (section && section.children) {
      this._sections = [section];
    } else {
      this._sections = [];
    }
    this._matchers = [];
  }

  /**
   * A predicate function that string lists
   * @typedef {function(node)} matcherFunction
   * @param {string[]} types a list of child types
   * @returns {boolean} true for matching string arrays
   */

  /**
   * Registers a type detector for nodes sequences that match either a content expression
   * or a matcher predicate function. The `matcher` will be evaluated against every
   * node in the MDAST. In cases where the `matcher` matches (returns true), the
   * processor will be called with the current node.
   * @param {(string|matcherFunction)} matcher either an unist-util-select expression
   * or a predicate function
   * @param {string} type the appropriate handler function to handle matching types.
   * @returns {TypeMatcher} this, enabling chaining
   */
  match(matcher, type) {
    const matchfn = typeof matcher === 'function' ? matcher : TypeMatcher.matchfn(matcher);

    this._matchers.push([matchfn, type]);

    return this;
  }

  /**
   * Finds all matching types for a given sequence of content types
   * @private
   * @param {string[]} types an array of content types
   * @returns {string[]} the array of matching types
   */
  matches(types) {
    return this._matchers
      .filter(([matchfn]) => matchfn(types))
      .map(([_, type]) => type);
  }


  /**
   * Turns a content expression into a matcher predicate function
   * @private
   * @param {string} pattern a regex-like content expression
   * @returns {matcherFunction} a corresponding matcher function that returns true
   * for sequences matching the pattern
   */
  static matchfn(pattern) {
    return function matchtypes(types) {
      return match(types, pattern);
    };
  }

  /**
   * Processes the registered matchers and returns the sections provided
   * in the constructor with the matched types pushed to the types property.
   * @returns {(Node|Node[])} the processed sections
   */
  process() {
    const mapped = this._sections.map((section) => {
      // get the type for each node, skip everything that's not a node or
      // doesn't have a type
      const childtypes = section.children
        ? section.children.map((node) => node.type).filter((type) => !!type)
        : [];
      const matchedtypes = this.matches(childtypes);
      const oldtypes = section.types && Array.isArray(section.types) ? section.types : [];

      return { types: [...matchedtypes, ...oldtypes], ...section };
    });
    if (mapped.length === 1) {
      return mapped[0];
    }
    return mapped;
  }
}

module.exports = TypeMatcher;
