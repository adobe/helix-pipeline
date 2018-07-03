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

class Pipeline {
  constructor(constants = {}, logger) {
    this.constants = constants;
    this.logger = logger;
    this.last = [];
    this.pres = [];
    this.posts = [];
    this.oncef = null;
  }

  pre(f) {
    this.pres.push(f);
    return this;
  }

  post(f) {
    this.posts.push(f);
    return this;
  }

  when(predicate) {
    if (this.last && this.last.length > 0) {
      const lastfunc = this.last.pop();
      const wrappedfunc = (args) => {
        if (predicate(args)) {
          return lastfunc(args, this.constants, this.logger);
        }
        return args;
      };
      this.last.push(wrappedfunc);
    }
    return this; 
  }

  unless(predicate) {
    const inverse = (args) => !predicate(args);
    return this.when(inverse);
  }

  once(f) {
    this.oncef = f;
    return this;
  }

  run(args = {}) {
    // go over inner.pres (those that run before), inner.oncef (the function that runs once)
    // and inner.posts (those that run after) – reduce using the merge function and return
    // the resolved value
    const prom = Promise.reduce(
      [...this.pres, this.oncef, ...this.posts],
      this.merge,
      args,
    ).then(v => v);

    return prom;
  }

  merge(accumulator, currentfunction) {
    // copy the pipeline payload into a new object
    // to avoid modifications
    const mergedargs = _.merge({}, accumulator);

    // log the function that is being called
    // and the parameters of the function
    if (this.logger) {
      this.logger.silly('processing ', { function: `${currentfunction}`, params: mergedargs });
    }

    return Promise.resolve(currentfunction(mergedargs, this.constants, this.logger))
      .then((value) => {
        const result = _.merge(accumulator, value);
        if (this.logger) {
          inner.logger.silly('received ', { function: `${currentfunction}`, result });
        }
        return result;
      });
  };
}

function attacher() {
  const inner = (args = {}, constants, logger) => {
    // save the second and third argument, they don't get modified
    // over time
    inner.constants = constants;
    inner.logger = logger;
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
   * @param {Map} currentfunction typically: the last function's return value
   */
  inner.merge = (accumulator, currentfunction) => {
    // copy the pipeline payload into a new object
    // to avoid modifications
    const mergedargs = _.merge({}, accumulator);

    // log the function that is being called
    // and the parameters of the function
    if (inner.logger) {
      inner.logger.silly('processing ', { function: `${currentfunction}`, params: mergedargs });
    }

    return Promise.resolve(currentfunction(mergedargs, inner.constants, inner.logger))
      .then((value) => {
        const result = _.merge(accumulator, value);
        if (inner.logger) {
          inner.logger.silly('received ', { function: `${currentfunction}`, result });
        }
        return result;
      });
  };
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

module.exports = Pipeline;
