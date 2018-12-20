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
const callsites = require('callsites');
const coerce = require('./utils/coerce-secrets');

const noOp = () => {};
const nopLogger = {
  debug: noOp,
  warn: noOp,
  silly: noOp,
  log: noOp,
  info: noOp,
  verbose: noOp,
  error: noOp,
  level: 'error',
};

/**
 * Simple wrapper to mark a function as error handler
 * @private
 */
function errorWrapper(fn) {
  const wrapper = (...args) => fn(...args);
  wrapper.errorHandler = true;
  return wrapper;
}

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

    coerce(this._action);

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
  before(f) {
    this.describe(f);
    this._pres.push(f);
    this._last = this._pres;
    return this;
  }

  /**
   * Adds a processing function to the `pre` list to this pipeline.
   * @param {pipelineFunction} f function to add to the `post` list
   * @returns {Pipeline} this
   */
  after(f) {
    this.describe(f);
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
    this.describe(f);
    this._oncef = f;
    this._last = this._posts;
    return this;
  }

  /**
   * Sets an error function. The error function is executed if the `context` contains an `error`
   * object.
   * @param {pipelineFunction} f the error function.
   * @return {Pipeline} this;
   */
  error(f) {
    this.describe(f);

    const wrapped = errorWrapper(f);
    // ensure proper alias
    wrapped.alias = f.alias;
    this._last.push(wrapped);
    return this;
  }

  /**
   * This helper method generates a human readable name for a given function
   * It will include:
   * - the name of the function or "anonymous"
   * - the name of the function that called describe
   * - the name and code location of the function that called the function before
   * @param {Function} f
   */
  describe(f) {
    if (!this._action
        || !this._action.logger
        || !this._action.logger.level
        || this._action.logger.level !== 'silly') {
      // skip capturing the stack trace when it is mever read
      return 'anonymous';
    }
    if (f.alias) {
      return f.alias;
    }
    if (!f.alias && f.name) {
      // eslint-disable-next-line no-param-reassign
      f.alias = f.name;
    } else if (!f.name && !f.alias) {
      // eslint-disable-next-line no-param-reassign
      f.alias = 'anonymous';
    }

    const [current, injector, caller] = callsites();
    if (current.getFunctionName() === 'describe') {
      // eslint-disable-next-line no-param-reassign
      f.alias = `${injector.getFunctionName()}:${f.alias} from ${caller.getFileName()}:${caller.getLineNumber()}`;
    }

    return f.alias;
  }

  /**
   * Runs the pipline processor be executing the `pre`, `once`, and `post` functions in order.
   * @param {Context} context Pipeline context
   * @returns {Promise<Context>} Promise that resolves to the final result of the accumulated
   * context.
   */
  async run(context = {}) {
    /**
     * Reduction function used to process the pipeline functions and merge the context parameters.
     * @param {Object} currContext Accumulated context
     * @param {pipelineFunction} currFunction Function that is currently "reduced"
     * @param {number} index index of the function in the given array
     * @returns {Promise} Promise resolving to the new value of the accumulator
     */
    const merge = async (currContext, currFunction, index) => {
      const skip = (!currContext.error) === (!!currFunction.errorHandler);

      // log the function that is being called and the parameters of the function
      this._action.logger.silly(skip ? 'skipping ' : 'processing ', {
        function: this.describe(currFunction),
        index,
        params: currContext,
      });

      if (skip) {
        return currContext;
      }

      // copy the pipeline payload into a new object to avoid modifications
      const mergedargs = _.merge({}, currContext);
      const tapresults = this._taps.map((f) => {
        try {
          return f(mergedargs, this._action, index);
        } catch (e) {
          return Promise.reject(e);
        }
      });

      return Promise.all(tapresults)
        .then(() => Promise.resolve(currFunction(mergedargs, this._action))
          .then((value) => {
            const result = _.merge(currContext, value);
            this._action.logger.silly('received ', { function: this.describe(currFunction), result });
            return result;
          })).catch((e) => {
          // tapping failed
          this._action.logger.warn(`tapping failed: ${e}`, e);
          return {
            error: `${currContext.error || ''}\n${e}`,
          };
        });
    };

    // go over inner.pres (those that run before), inner.oncef (the function that runs once)
    // and inner.posts (those that run after) – reduce using the merge function and return
    // the resolved value
    return [...this._pres, this._oncef, ...this._posts]
      .filter(e => typeof e === 'function')
      .reduce(async (ctx, fn, index) => merge(await ctx, fn, index), context);
  }
}

module.exports = Pipeline;
