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

import assert from 'assert';
import { defaults } from '../index.js';

const { log, pipe, pre } = defaults;

describe('Testing Default Pipeline', () => {
  it('Default Pipeline can be loaded', () => {
    assert.ok(pipe, 'no default pipeline found');
    assert.ok(pre, 'no default pre.js found');
    assert.ok(log, 'no logger found');
  });

  it('creates and runs the default pipeline', async () => {
    const out = await pipe((context, action) => {
      context.body = `test. context: ${context.title} action: ${action.title}`;
    }, {
      title: 'my context',
    }, {
      title: 'my action',
    });
    assert.deepStrictEqual(out, {
      body: 'test. context: my context action: my action',
      title: 'my context',
    });
  });
});
