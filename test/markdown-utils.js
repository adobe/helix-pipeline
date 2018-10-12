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
/* eslint-env mocha */
const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const validate = require('../src/utils/validate.js');

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

function context(name, cb) {
  const mddoc = fs.readFileSync(path.resolve(__dirname, 'fixtures', `${name}.md`)).toString();
  const out = cb(mddoc);
  return out;
}

module.exports.assertMatch = function assertMatch(name, cb) {
  const mdast = fs.readJsonSync(path.resolve(__dirname, 'fixtures', `${name}.json`));
  const out = context(name, cb);

  try {
    return assert.deepEqual(out, mdast);
  } catch (e) {
    fs.writeJsonSync(`${name}.json`, out, { spaces: 2 });
    return assert.deepEqual(out, mdast);
  }
};

module.exports.assertValid = function assertValid(name, cb, done) {
  const out = context(name, cb);
  return validate(out, { logger: nopLogger }, 0)
    .then(() => {
      done();
    })
    .catch((e) => {
      done(e);
    });
};
