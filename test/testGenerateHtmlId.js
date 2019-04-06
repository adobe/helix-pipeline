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
const check = require('../src/utils/generate-html-id');

describe('Test generate-html-id', () => {
  it('returns the lowercase version of the provided text', () => {
    assert.equal('foo', check.generateId('foo'));
    assert.equal('bar', check.generateId('Bar'));
    assert.equal('baz', check.generateId('BAZ'));
  });

  it('separates camelcase words in the identifier', () => {
    assert.equal('f-oo', check.generateId('fOo'));
    assert.equal('ba-r', check.generateId('baR'));
  });

  it('replaces white spaces with a simple dash', () => {
    assert.equal('foo-bar', check.generateId('foo bar'));
  });

  it('removes special characters', () => {
    assert.equal('foo', check.generateId('foo!'));
    assert.equal('bar', check.generateId('=bar'));
    assert.equal('ba-z', check.generateId('ba?z'));
  });

  it('supports accented characters', () => {
    assert.equal('foo', check.generateId('fòó'));
    assert.equal('bar', check.generateId('bär'));
    assert.equal('baz', check.generateId('bâz'));
    assert.equal('qux', check.generateId('qũx'));
    assert.equal('corge', check.generateId('çŏrgę'));
  });

  it('supports unicode foreign scripts', () => {
    assert.equal('汉字-漢字', check.generateId('汉字 漢字'));
    assert.equal('العربية', check.generateId('العربية'));
    assert.equal('кириллица', check.generateId('кириллица'));
    assert.equal('かな-カナ', check.generateId('かな カナ'));
    assert.equal('한글-조선글', check.generateId('한글 조선글'));
    assert.equal('ελληνικό', check.generateId('ελληνικό'));
  });
});
