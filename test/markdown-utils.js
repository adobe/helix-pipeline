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
import path from 'path';
import assert from 'assert';
import fs from 'fs-extra';
import { removePosition } from 'unist-util-remove-position';
import validate from '../src/utils/validate.js';

function cleanUp(json) {
  if (json) {
    if (json.map) {
      return json.map((node) => removePosition(node, true));
    }
    return removePosition(json, true);
  }
  return json;
}

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

function context(dir, name, cb) {
  const mddoc = fs.readFileSync(path.resolve(__testdir, 'fixtures', dir, `${name}.md`)).toString();
  const out = cb(mddoc);
  return out;
}

export function assertMatchDir(dir, name, cb) {
  const mdast = cleanUp(fs.readJsonSync(path.resolve(__testdir, 'fixtures', dir, `${name}.json`)));
  const out = cleanUp(context(dir, name, cb));

  try {
    return assert.deepEqual(out, mdast);
  } catch (e) {
    fs.writeJsonSync(`${name}.json`, out, { spaces: 2 });
    return assert.deepEqual(out, mdast);
  }
}

export function assertValidDir(dir, name, cb, done) {
  const out = context(dir, name, cb);
  try {
    validate(out, { logger: nopLogger }, 0);
    done();
  } catch (e) {
    done(e);
  }
}

export function assertMatch(name, cb) {
  assertMatchDir('', name, cb);
}

export function assertValid(name, cb, done) {
  assertValidDir('', name, cb, done);
}
