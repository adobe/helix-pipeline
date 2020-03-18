/*
 * Copyright 2020 Adobe. All rights reserved.
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
const { directives, format, merge } = require('../src/utils/cache-helper');

describe('Cache Helper Tests (surrogate)', () => {
  it('directive parses directives', () => {
    assert.deepStrictEqual(directives('max-age=300'), {
      'max-age': 300,
    });

    assert.deepStrictEqual(directives('s-maxage=300,  max-age=300'), {
      's-maxage': 300,
      'max-age': 300,
    });

    assert.deepStrictEqual(directives('s-maxage=300,  max-age=300, public'), {
      's-maxage': 300,
      'max-age': 300,
      public: true,
    });

    assert.deepStrictEqual(directives(''), {});

    assert.deepStrictEqual(directives(), {});
  });

  it('format formats directives', () => {
    assert.equal(format({}), '');
    assert.equal(format(undefined), '');

    assert.equal(format({
      'max-age': 300,
      public: true,
    }), 'max-age=300, public');
  });

  it('merge merges two directives', () => {
    assert.deepEqual(merge({}, {}), {});

    assert.deepEqual(merge({
      'max-age': 300,
    }, {
      's-maxage': 300,
    }), {
      's-maxage': 300,
      'max-age': 300,
    });

    assert.deepEqual(merge({
      'max-age': 300,
      's-maxage': 600,
    }, {
      's-maxage': 300,
      'max-age': 600,
    }), {
      's-maxage': 300,
      'max-age': 300,
    });

    assert.deepEqual(merge({
      public: true,
    }, {
      private: true,
    }), {
      public: true,
      private: true,
    });

    assert.equal(merge('max-age=300, public', 'max-age=600'), 'max-age=300, public');

    assert.equal(merge(), '');
  });
});
