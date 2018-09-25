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

/**
 * Turns a content-expression like "heading? (paragraph|image)+" into
 * a proper regular expression.
 * @param {string} pattern
 * @returns {RegExp} a regular expression that matches strings following
 * the high-level pattern.
 */
function compile(pattern) {
  const expression = new RegExp(pattern
    .replace(/(\w+)/g, '($1·)') // always match whole words
    .replace(/ /g, '') // remove spaces
    .toString());
  // console.log('=> ' + expression);
  return expression;
}

/**
 * Determines if the provided list of child nodes matches the
 * type expression
 * @param {string[]} list a list of node types
 * @param {string} pattern a content-expression like "heading? (paragraph|image)+"
 * @returns true if the list matches the pattern
 */
function match(list, pattern) {
  const str = `${list.join('·')}·`;
  // console.log('-> ' + str);
  const matches = !!compile(pattern).test(str);
  // console.log(matches);
  return matches;
}

module.exports = {
  compile,
  match,
};
