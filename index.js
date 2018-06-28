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
const _ = require('lodash/fp');
const Promise = require('bluebird');

function attacher() {
  const inner = (args = {}) => {
    // go over inner.pres (those that run before), inner.oncef (the function that runs once)
    // and inner.posts (those that run after) – reduce using the merge function and return
    // the resolved value
    const prom = Promise.reduce(
      [...inner.pres, inner.oncef, ...inner.posts],
      inner.merge,
      args,
    ).then(v => v);

    return prom;
  };

  /**
   * A reducer function that performs a deep merge of accumulator and
   * currentvalue
   * @param {Map} accumulator typically: the pipeline payload
   * @param {Map} currentvalue typically: the last function's return value
   */
  inner.merge = (accumulator, currentvalue) =>
    Promise.resolve(currentvalue(_.merge({}, accumulator)))
      .then(value => _.merge(accumulator, value));

  /**
   * Adds the function outer to the list of functions to be executed
   * before the main function, and returns the attacher itself, for
   * easy chaining
   */
  inner.pre = (outer) => {
    inner.pres.push(outer);
    inner.last = inner.pres;
    return inner;
  };

  /**
   * Adds the function outer to the list of functions to be executed
   * after the main function, and returns the attacher itself, for
   * easy chaining
   */
  inner.post = (outer) => {
    inner.posts.push(outer);
    inner.last = inner.post;
    return inner;
  };

  /**
   * Applies a condition pred (predicate function) to the last pre or post function added
   * and returns the attacher itself, for easy chaining
   */
  inner.when = (pred) => {
    if (inner.last && inner.last.length > 0) {
      const lastfunc = inner.last.pop();
      const wrappedfunc = (args) => {
        if (pred(args)) {
          return lastfunc(args);
        }
        return args;
      };
      inner.last.push(wrappedfunc);
    }
    return inner;
  };

  /* eslint-disable no-unused-expressions */
  /**
   * Works like inner.when, but with inverted predicates.
   * @param {function} pred
   */
  inner.unless = pred => inner.when(args => !pred(args));

  inner.last;
  inner.pres = [];
  inner.posts = [];
  inner.oncef = args => args;

  /**
   * Sets the function outer to be the main function
   * and returns the attacher itself, for easy chaining
   * @param {function} outer
   */
  inner.once = (outer) => {
    inner.oncef = outer;
    return inner;
  };

  return inner;
}

module.exports = attacher;
