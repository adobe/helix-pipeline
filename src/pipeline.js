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

const nopLogger = {
  error: () => {},
  warn: () => {},
  info: () => {},
  verbose: () => {},
  debug: () => {},
  silly: () => {},
};

/**
 * Pipeline function
 *
 * @typedef {function(context, _action, logger)} pipelineFunction
 * @callback pipelineFunction
 * @param {Object} context Pipeline execution context that is passed along
 * @param {Object} action Pipeline action define during construction
 * @param {Winston.Logger} logger Logger
 * @return {Promise} Promise which resolves to a parameters to be added to the context.
*/

/**
 * Pipeline that allows to execute a list of functions in order. The pipeline consists of 3
 * major function lists: `pre`, `once` and, `post`. the functions added to the `pre` list are
 * processed first, then the `once` function and finally the `post` functions.
 * Using `when` and `unless` allows to conditionally execute the previously define function.
 * @class
 */
class Pipeline {
  /**
   * Creates a new pipeline.
   * @param {Object} action Action properties that are available to all pipeline functions.
   * @param {Winston.Logger} logger Winston logger to use
   */
  constructor(action = {}, logger = nopLogger) {
    logger.debug('Creating pipeline');

    this._action = action;
    this._logger = logger;

    // function chain that was defined last. used for `when` and `unless`
    this._last = null;
    // functions that are executed first
    this._pres = [];
    // function that is executed once
    this._oncef = null;
    // functions that are executed after
    this._posts = [];
  }

  /**
   * Adds a processing function to the `pre` list to this pipeline.
   * @param {pipelineFunction} f function to add to the `post` list
   * @returns {Pipeline} this
   */
  pre(f) {
    this._pres.push(f);
    this._last = this._pres;
    return this;
  }

  /**
   * Adds a processing function to the `pre` list to this pipeline.
   * @param {pipelineFunction} f function to add to the `post` list
   * @returns {Pipeline} this
   */
  post(f) {
    this._posts.push(f);
    this._last = this._posts;
    return this;
  }

  /**
   * Adds a condition to the previously defined `pre` or `post` function. The previously defined
   * function will only be executed if the predicate evaluates to something truthy or returns a
   * Promise that resolves to something truthy.
   * @param {function} predicate Predicate function.
   * @returns {Pipeline} this
   */
  when(predicate) {
    if (this._last && this._last.length > 0) {
      const lastfunc = this._last.pop();
      const wrappedfunc = (args) => {
        const result = predicate(args);
        // check if predicate returns a promise like result
        if (_.isFunction(result.then)) {
          return result.then((predResult) => {
            if (predResult) {
              return lastfunc(args, this._action, this._logger);
            }
            return args;
          });
        } if (result) {
          return lastfunc(args, this._action, this._logger);
        }
        return args;
      };
      this._last.push(wrappedfunc);
    } else {
      throw new Error('when() needs function to operate on.');
    }
    return this;
  }

  /**
   * Adds a condition to the previously defined `pre` or `post` function. The previously defined
   * function will only be executed if the predicate evaluates to something not-truthy or returns a
   * Promise that resolves to something not-truthy.
   * @param {function} predicate Predicate function.
   * @returns {Pipeline} this
   */
  unless(predicate) {
    const inverse = args => !predicate(args);
    return this.when(inverse);
  }

  /**
   * Sets the `once` processing function.
   * @param {pipelineFunction} f the `once` function to set
   * @returns {Pipeline} this
   */
  once(f) {
    this._oncef = f;
    this._last = null;
    return this;
  }

  /**
   * Runs the pipline processor be executing the `pre`, `once`, and `post` functions in order.
   * @param context Pipeline context
   * @returns {Promise} Promise that resolves to the final result of the accumulated context.
   */
  run(context = {}) {
    /**
     * Reduction function used to process the pipeline functions and merge the context parameters.
     * @param {Object} currContext Accumulated context
     * @param {pipelineFunction} currFunction Function that is currently "reduced"
     * @returns {Promise} Promise resolving to the new value of the accumulator
     */
    const merge = (currContext, currFunction) => {
      // copy the pipeline payload into a new object to avoid modifications
      const mergedargs = _.merge({}, currContext);

      // log the function that is being called and the parameters of the function
      this._logger.silly('processing ', { function: `${currFunction}`, params: mergedargs });

      return Promise.resolve(currFunction(mergedargs, this._action, this._logger))
        .then((value) => {
          const result = _.merge(currContext, value);
          this._logger.silly('received ', { function: `${currFunction}`, result });
          return result;
        });
    };

    // go over inner.pres (those that run before), inner.oncef (the function that runs once)
    // and inner.posts (those that run after) – reduce using the merge function and return
    // the resolved value
    return Promise.reduce(
      [...this._pres, this._oncef, ...this._posts].filter(e => typeof e === 'function'),
      merge,
      context,
    ).then(v => v);
  }
}

module.exports = Pipeline;
