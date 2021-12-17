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
import _ from 'lodash/fp.js';
import callsites from 'callsites';
import { enumerate, iter } from 'ferrum';
import coerce from './html/coerce-secrets.js';
import Downloader from './utils/Downloader.js';

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
 * Pipeline that allows to execute a list of functions in the order they have been added.
 * Using `when` and `unless` allows to conditionally execute the previously defined function.
 * @class
 */
export default class Pipeline {
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
    // object with the custom functions to attach to the pipeline
    this._attachments = null;
    // step functions to execute
    this._steps = [];
    // functions that are executed before each step
    this._taps = [];

    /**
     * Registers an extension to the pipeline.
     * @param {String} name - name of the extension point (typically the function name).
     * @param {pipelineFunction} f - a new pipeline step that will be injected relative to `name`.
     * @param {integer} offset - where to insert the new function (-1: before, 0: replace, 1: after)
     */
    const attachGeneric = (name, f, offset) => {
      // find the index of the function where the resolved ext name
      // matches the provided name by searching the list of step functions
      const foundstep = this._steps
        .findIndex((step) => step && step.ext && step.ext === name);

      // if something has been found in the list, insert the
      // new function into the list, with the correct offset
      if (foundstep !== -1) {
        if (offset === 0) {
          // replace
          this._steps.splice(foundstep, 1, f);
        } else if (offset > 0) {
          // insert after
          this._steps.splice(foundstep + 1, 0, f);
        } else {
          // insert before (default)
          this._steps.splice(foundstep, 0, f);
        }
      } else {
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
    this.attach.before = (name, f) => attachGeneric.bind(this)(name, f, -1);
    /**
     * Registers an extension to the pipeline. The function `f` will be run in
     * the pipeline after the function called `name` will be executed. If `name`
     * does not exist, `f` will never be executed.
     * @param {String} name - name of the extension point (typically the function name).
     * @param {pipelineFunction} f - a new pipeline step that will be injected relative to `name`.
     */
    this.attach.after = (name, f) => attachGeneric.bind(this)(name, f, 1);
    /**
     * Registers an extension to the pipeline. The function `f` will be executed in
     * the pipeline instead of the function called `name`. If `name` does not exist,
     * `f` will never be executed.
     * @param {String} name - name of the extension point (typically the function name).
     * @param {pipelineFunction} f - a new pipeline step that will replace `name`.
     */
    this.attach.replace = (name, f) => attachGeneric.bind(this)(name, f, 0);
  }

  /**
   * Adds a processing function to the `step` list of this pipeline.
   * @param {pipelineFunction} f function to add to the `step` list
   * @returns {Pipeline} this
   */
  use(f) {
    this.describe(f);
    this._steps.push(f);
    this._last = this._steps;
    // check for extensions
    if (f && (f.before || f.replace || f.after)) {
      if (typeof this._attachments === 'function') {
        throw new Error(`Step '${this._attachments.alias}' already registered extensions for this pipeline, refusing to add more with '${f.alias}'.`);
      }
      this._attachments = f;
    }
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
   * Adds a condition to the previously defined `step` function. The previously defined
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
        const result = predicate(...args);
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
      wrappedfunc.title = lastfunc.title;
      wrappedfunc.ext = lastfunc.ext;
      this._last.push(wrappedfunc);
    } else {
      throw new Error('when() needs function to operate on.');
    }
    return this;
  }

  /**
   * Adds a condition to the previously defined `step` function. The previously defined
   * function will only be executed if the predicate evaluates to something not-truthy or returns a
   * Promise that resolves to something not-truthy.
   * @param {function(context)} predicate Predicate function.
   * @callback predicate
   * @returns {Pipeline} this
   */
  unless(predicate) {
    const inverse = (args) => !predicate(args);
    return this.when(inverse);
  }

  /**
   * Attaches custom extensions to the pipeline. The expected argument is an object
   * with a <code>before</code> object, an <code>after</code> object, and/or
   * a <code>replace</code> object as its properties.
   * Each of these objects can have keys that correspond to the named extension points
   * defined for the pipeline, with the function to execute as values. For example:
   * <pre>
   * {
   *   before: {
   *     fetch: (context, action) => {
   *       // do something before the fetch step
   *       return context;
   *     }
   *   }
   *   replace: {
   *     html: (context, action) => {
   *       // do this instead of the default html step
   *       return context;
   *     }
   *   }
   *   after: {
   *     meta: (context, action) => {
   *       // do something after the meta step
   *       return context;
   *     }
   *   }
   * }
   * </pre>
   * @param {Object} att The object containing the attachments
   */
  attach(att) {
    if (att && att.before && typeof att.before === 'object') {
      Object.keys(att.before).map((key) => this.attach.before(key, att.before[key]));
    }
    if (att && att.after && typeof att.after === 'object') {
      Object.keys(att.after).map((key) => this.attach.after(key, att.after[key]));
    }
    if (att && att.replace && typeof att.replace === 'object') {
      Object.keys(att.replace).map((key) => this.attach.replace(key, att.replace[key]));
    }
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
    wrapped.title = f.title;
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
      return;
    }

    f.alias = f.name || f.ext || 'anonymous';
    f.title = f.alias;

    const [current, injector, caller] = callsites();
    if (current.getFunctionName() === 'describe' && caller) {
      f.title = `${injector.getFunctionName()}:${f.alias}`;
      f.alias = `${f.title} from ${caller.getFileName()}:${caller.getLineNumber()}`;
    }
  }

  /**
   * Runs the pipline processor be executing the `step` functions in order.
   * @param {Context} context Pipeline context
   * @returns {Promise<Context>} Promise that resolves to the final result of the accumulated
   * context.
   */
  async run(context = {}) {
    const { logger } = this._action;

    // register all custom attachers to the pipeline
    this.attach(this._attachments);

    // setup the download manager
    if (!this._action.downloader) {
      this._action.downloader = new Downloader(context, this._action);
    }

    /**
     * Executes the taps of the current function.
     * @param {Function[]} taps the taps
     * @param {string} fnIdent the name of the function
     * @param {number} fnIdx the current idx of the function
     */
    const execTaps = async (taps, fnIdent, fnIdx) => {
      for (const [idx, t] of iter(taps)) {
        const ident = `#${String(fnIdx).padStart(2, '0')}/${fnIdent}/tap-#${idx}`;
        logger.silly(`exec ${ident}`);
        try {
          await t(context, this._action, fnIdx, fnIdent);
        } catch (e) {
          logger.error(`Exception during ${ident}:\n${e.stack}`);
          throw e;
        }
      }
    };

    /**
     * Executes the pipeline functions
     * @param {Function[]} fns the functions
     */
    const execFns = async (fns) => {
      for (const [idx, f] of enumerate(fns)) {
        const ident = `#${String(idx).padStart(2, '0')}/${f.alias}`;

        // skip if error and no error handler (or no error and error handler)
        if ((!context.error) === (!!f.errorHandler)) {
          logger.silly(`skip ${ident}`, {
            function: f.alias,
          });
          // eslint-disable-next-line no-continue
          continue;
        }

        try {
          await execTaps(enumerate(this._taps), f.title, idx);
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
            function: f.alias,
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
      await execFns(this._steps);
    } catch (e) {
      logger.error(`Unexpected error during pipeline execution: \n${e.stack}`);
      if (!context.error) {
        context.error = e;
      }
    } finally {
      this._action.downloader.destroy();
    }
    return context;
  }
}
