/*
 * Copyright 2021 Adobe. All rights reserved.
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
const { paginate } = require('../src/html/data-sections').testable;

describe('Test Pagination Helper #unit', () => {
  const data = [
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eightteen', 'nineteen', 'twenty',
    'twentyone', 'twentytwo',
  ];
  it('Does not filter when no parameters given', () => {
    const result = data.filter(paginate());
    assert.deepEqual(result, data);
  });

  it('Returns first page when no page is given', () => {
    const result = data.filter(paginate(10));
    assert.deepEqual(result, ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);
  });

  it('Returns second page when asked', () => {
    const result = data.filter(paginate(10, 2));
    assert.deepEqual(result, ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eightteen', 'nineteen', 'twenty']);
  });

  it('Returns (incomplete) third page when asked', () => {
    const result = data.filter(paginate(10, 3));
    assert.deepEqual(result, ['twentyone', 'twentytwo']);
  });

  it('Returns (complete) third page when page', () => {
    const result = data.filter(paginate(10, 3));
    assert.deepEqual(result, ['twentyone', 'twentytwo']);
  });
});
