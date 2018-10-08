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
  log: () => {},
};

/**
 * @typedef {Object} Context
 * @param {Winston.Logger} logger Winston logger to use
 */

/**
 * @typedef {Object} Action
 */

/**
 * Pipeline function
 *
 * @typedef {function(context, _action)} pipelineFunction
 * @callback pipelineFunction
 * @param {Context} context Pipeline execution context that is passed along
 * @param {Action} action Pipeline action define during construction
 * @return {Promise<Context>} Promise which resolves to a parameters to be added to the context.
*/

/**
 * Tap function
 *
 * @typedef {function(context, _action, index)} tapFunction
 * @callback tapFunction
 * @param {Context} context Pipeline execution context that is passed along
 * @param {Action} action Pipeline action define during construction
 * @param {number} index index of the function invocation order
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
   * @param {Action} action Action properties that are available to all pipeline functions.
   */
  constructor(action = {}) {
    this._action = action;
    this._action.logger = action.logger || nopLogger;

    this._action.logger.debug('Creating pipeline');

    // function chain that was defined last. used for `when` and `unless`
    this._last = null;
    // functions that are executed first
    this._pres = [];
    // function that is executed once
    this._oncef = null;
    // functions that are executed after
    this._posts = [];
    // functions that are executed before each step
    this._taps = [];
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
   * Adds a tap (observing) function to the pipeline. taps are executed for every
   * single pipeline step and best used for validation, and logging. taps don't have
   * any effect, i.e. the return value of a tap function is ignored.
   * @param {pipelineFunction} f function to be executed in every step. Effects are ignored.
   */
  every(f) {
    this._taps.push(f);
    this._last = this._taps;
    return this;
  }

  /**
   * Adds a condition to the previously defined `pre` or `post` function. The previously defined
   * function will only be executed if the predicate evaluates to something truthy or returns a
   * Promise that resolves to something truthy.
   * @param {function(context)} predicate Predicate function.
   * @callback predicate
   * @param {Context} context
   * @returns {Pipeline} this
   */
  when(predicate) {
    if (this._last && this._last.length > 0) {
      const lastfunc = this._last.pop();
      const wrappedfunc = (...args) => {
        const result = predicate(args[0]);
        // check if predicate returns a promise like result
        if (_.isFunction(result.then)) {
          return result.then((predResult) => {
            if (predResult) {
              return lastfunc(...args);
            }
            return args[0];
          });
        } if (result) {
          return lastfunc(...args);
        }
        return args[0];
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
   * @param {function(context)} predicate Predicate function.
   * @callback predicate
   * @param {Context} context
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
   * @param {Context} context Pipeline context
   * @returns {Promise<Context>} Promise that resolves to the final result of the accumulated
   * context.
   */
  run(context = {}) {
    /**
     * Reduction function used to process the pipeline functions and merge the context parameters.
     * @param {Object} currContext Accumulated context
     * @param {pipelineFunction} currFunction Function that is currently "reduced"
     * @returns {Promise} Promise resolving to the new value of the accumulator
     */
    const merge = (currContext, currFunction, index) => {
      // copy the pipeline payload into a new object to avoid modifications
      const mergedargs = _.merge({}, currContext);

      // log the function that is being called and the parameters of the function
      this._action.logger.silly('processing ', { function: `${currFunction}`, index, params: mergedargs });

      this._taps.map(f => f(mergedargs, this._action, index));

      return Promise.resolve(currFunction(mergedargs, this._action))
        .then((value) => {
          const result = _.merge(currContext, value);
          this._action.logger.silly('received ', { function: `${currFunction}`, result });
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
