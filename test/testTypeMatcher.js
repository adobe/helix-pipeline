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
const fs = require('fs-extra');
const path = require('path');
const assert = require('assert');
const TypeMatcher = require('../src/utils/match-section-types');

describe('Test Type Matcher Util', () => {
  const sections = fs.readJSONSync(path.resolve(__dirname, 'fixtures', 'sections.json'));

  it('TypeMatcher works with empty input', () => {
    assert.deepEqual(new TypeMatcher(null).process(), []);
    assert.deepEqual(new TypeMatcher().process(), []);
    assert.deepEqual(new TypeMatcher([]).process(), []);
    assert.deepEqual(new TypeMatcher([
      { type: 'root' },
    ]).process(), { type: 'root', types: [] });
  });

  it('TypeMatcher returns empty array if no matchers are registered', () => {
    assert.deepEqual(new TypeMatcher(sections[0])
      .process().types, []);
  });

  it('TypeMatcher matches simple expressions', () => {
    assert.deepEqual(new TypeMatcher(sections[0])
      .match('heading', 'has-heading')
      .process().types, ['has-heading']);
  });

  it('TypeMatcher matches multiple expressions', () => {
    assert.deepEqual(new TypeMatcher(sections[0])
      .match('heading', 'has-heading')
      .match('paragraph', 'has-paragraph')
      .match('impossible', 'has-impossible')
      .process().types, ['has-heading', 'has-paragraph']);
  });

  it('TypeMatcher can match with functions', () => {
    assert.deepEqual(new TypeMatcher(sections[0])
      .match('heading', 'has-heading')
      .match('paragraph', 'has-paragraph')
      .match((types) => types.length >= 3, 'long')
      .process().types, ['has-heading', 'has-paragraph', 'long']);
  });

  it('TypeMatcher can match with functions', () => {
    const matchedsections = new TypeMatcher(sections)
      .match('heading', 'has-heading')
      .match('paragraph', 'has-paragraph')
      .match((types) => types.length >= 3, 'long')
      .process();
    assert.equal(matchedsections.length, 4);
    assert.ok(matchedsections[0].types);
    assert.ok(matchedsections[1].types);
    assert.deepEqual(matchedsections[2].types, ['has-heading', 'has-paragraph', 'long']);
    assert.deepEqual(matchedsections[3].types, ['has-heading', 'has-paragraph', 'long']);
  });
});
