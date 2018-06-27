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
  const inner = function (args = {}) {
    /*
        // run the functions inside inner.pres first
        const preval = inner.pres.reduce(inner.merge, _.merge({}, args));

        // then run the function inner.once
        const onceval = _.merge(preval, inner.oncef(_.merge({}, preval)));

        // then run each of the functions in inner.posts
        const postval = inner.posts.reduce(inner.posts, _.merge({}, onceval));

        // then return the accumulated value
        return postval;
        */
    const prom = Promise.reduce(
      [...inner.pres, inner.oncef, ...inner.posts],
      inner.merge,
      args,
    ).then(v => v);

    return prom;
  };

  inner.merge = function (accumulator, currentvalue) {
    return Promise.resolve(currentvalue(_.merge({}, accumulator))).then(value => _.merge(accumulator, value));
  };

  inner.pre = function (outer) {
    inner.pres.push(outer);
    inner.last = inner.pres;
    return inner;
  };

  inner.post = function (outer) {
    inner.posts.push(outer);
    inner.last = inner.post;
    return inner;
  };

  inner.when = function (pred) {
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

  inner.unless = function (pred) {
    inner.when(args => !pred(args));
    return inner;
  };

  inner.last;
  inner.pres = [];
  inner.posts = [];
  inner.oncef = function (args) {
    return args;
  };

  inner.once = function (outer) {
    inner.oncef = outer;
    return inner;
  };

  return inner;
}

module.exports = attacher;
