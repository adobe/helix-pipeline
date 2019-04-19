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

/* eslint-disable no-await-in-loop */

const _ = require('lodash/fp');
const callsites = require('callsites');
const { enumerate, iter } = require('@adobe/helix-shared').sequence;
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

    this.attach = (ext) => {
      if (this.sealed) {
        return;
      }
      if (ext && ext.before && typeof ext.before === 'object') {
        Object.keys(ext.before).map(key => this.attach.before(key, ext.before[key]));
      }
      if (ext && ext.after && typeof ext.after === 'object') {
        Object.keys(ext.after).map(key => this.attach.after(key, ext.after[key]));
      }
      this.sealed = true;
    };

    /**
     * Registers an extension to the pipeline.
     * @param {String} name - name of the extension point (typically the function name).
     * @param {pipelineFunction} f - a new pipeline step that will be injected relative to `name`.
     * @param {integer} before - where to insert the new function (true = before, false = after)
     */
    const attachGeneric = (name, f, before) => {
      const offset = before ? 0 : 1;
      // find the index of the function where the resolved ext name
      // matches the provided name by searching the list of pre and
      // post functions
      const foundpres = this._pres
        .findIndex(pre => pre && pre.ext && pre.ext === name);
      const foundposts = this._posts
        .findIndex(post => post && post.ext && post.ext === name);

      // if something has been found in either lists, insert the
      // new function into the list, with the correct offset
      if (foundpres !== -1) {
        this._pres.splice(foundpres + offset, 0, f);
      }
      if (foundposts !== -1) {
        this._posts.splice(foundposts + offset, 0, f);
      }
      if (foundpres === -1 && foundposts === -1) {
        this._action.logger.warn(`Unknown extension point ${name}`);
      }
    };
    /**
     * Registers an extension to the pipeline. The function `f` will be run in
     * the pipeline before the function called `name` will be executed. If `name`
     * does not exist, `f` will never be executed.
     * @param {String} name - name of the extension point (typically the function name).
     * @param {pipelineFunction} f - a new pipeline step that will be injected relative to `name`.
     */
    this.attach.before = (name, f) => attachGeneric.bind(this)(name, f, true);
    /**
     * Registers an extension to the pipeline. The function `f` will be run in
     * the pipeline after the function called `name` will be executed. If `name`
     * does not exist, `f` will never be executed.
     * @param {String} name - name of the extension point (typically the function name).
     * @param {pipelineFunction} f - a new pipeline step that will be injected relative to `name`.
     */
    this.attach.after = (name, f) => attachGeneric.bind(this)(name, f, false);
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
   * Declares the last function that has been added to be a named extension point
   * @param {string} name - name of the new extension point
   */
  expose(name) {
    this._last.slice(-1).pop().ext = name;
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
        } else if (result) {
          return lastfunc(...args);
        }
        return args[0];
      };
      wrappedfunc.alias = lastfunc.alias;
      wrappedfunc.ext = lastfunc.ext;
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
   * Sets an error function. The error function is executed when an error is encountered.
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
  // eslint-disable-next-line class-methods-use-this
  describe(f) {
    if (f.alias) {
      return f.alias;
    }

    f.alias = f.name || f.ext || 'anonymous';

    const [current, injector, caller] = callsites();
    if (current.getFunctionName() === 'describe') {
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
    const { logger } = this._action;

    // register all custom attachers to the pipeline
    this.attach(this._oncef);

    const getident = (fn, classifier, idx) => `${classifier}-#${idx}/${this.describe(fn)}`;

    /**
     * Executes the taps of the current function.
     * @param {Function[]} taps the taps
     * @param {string} fnIdent the name of the function
     * @param {number} fnIdx the current idx of the function
     */
    const execTaps = async (taps, fnIdent, fnIdx) => {
      for (const [idx, t] of iter(taps)) {
        const ident = getident(t, 'tap', idx);
        logger.silly(`exec ${ident} before ${fnIdent}`);
        try {
          await t(context, this._action, fnIdx);
        } catch (e) {
          logger.error(`Exception during ${ident}:\n${e.stack}`);
          throw e;
        }
      }
    };

    /**
     * Executes the pipeline functions
     * @param {Function[]} fns the functions
     * @param {number} startIdx offset of the function's index in the entire pipeline.
     * @param {string} classifier type of function (for logging)
     */
    const execFns = async (fns, startIdx, classifier) => {
      for (const [i, f] of enumerate(fns)) {
        const idx = i + startIdx;
        const ident = getident(f, classifier, idx);

        // skip if error and no error handler (or no error and error handler)
        if ((!context.error) === (!!f.errorHandler)) {
          logger.silly(`skip ${ident}`, {
            function: this.describe(f),
          });
          // eslint-disable-next-line no-continue
          continue;
        }

        try {
          await execTaps(enumerate(this._taps), ident, idx);
        } catch (e) {
          if (!context.error) {
            context.error = e;
          }
        }
        if (context.error && !f.errorHandler) {
          // eslint-disable-next-line no-continue
          continue;
        }
        try {
          logger.silly(`exec ${ident}`, {
            function: this.describe(f),
          });
          await f(context, this._action);
        } catch (e) {
          logger.error(`Exception during ${ident}:\n${e.stack}`);
          if (!context.error) {
            context.error = e;
          }
        }
      }
    };

    try {
      await execFns(this._pres, 0, 'pre');
      await execFns([this._oncef], this._pres.length, 'once');
      await execFns(this._posts, this._pres.length + 1, 'post');
    } catch (e) {
      logger.error(`Unexpected error during pipeline execution: \n${e.stack}`);
      if (!context.error) {
        context.error = e;
      }
    }
    return context;
  }
}

module.exports = Pipeline;
