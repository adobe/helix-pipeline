/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const fallback = require('mdast-util-to-hast/lib/handlers/heading');
const toString = require('mdast-util-to-string');
const GithubSlugger = require('github-slugger');

/**
 * Utility class injects heading identifiers during the MDAST to VDOM transformation.
 */
class HeadingHandler {
  /**
   * Initializes the handler
   */
  constructor() {
    // scoping the slugger instance to the current transform operation
    // so that heading uniqueness is guaranteed for each transformation separately
    this.slugger = new GithubSlugger();
  }

  /**
   * Reset the heading counter
   */
  reset() {
    this.slugger.reset();
  }

  /**
   * Returns the handler function
   */
  handler() {
    return (h, node) => {
      // Prepare the heading id
      const headingIdentifier = this.slugger.slug(toString(node));

      // Inject the id after transformation
      const n = Object.assign({}, node);
      const el = fallback(h, n);
      el.properties.id = headingIdentifier;
      return el;
    };
  }
}

module.exports = HeadingHandler;
