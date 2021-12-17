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
import { logging } from '@adobe/helix-testutils';
import coerce from '../src/html/coerce-secrets.js';

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

describe('Test Coercing Secrets', () => {
  it('Secrets will be created', async () => {
    const action = { logger };
    await coerce(action);
    assert.ok(action.secrets);
    assert.equal(typeof action.secrets, 'object');
  });

  it('Defaults have correct values', async () => {
    const action = { logger };
    await coerce(action);
    assert.ok(action.secrets.REPO_RAW_ROOT);
    assert.equal(action.secrets.REPO_RAW_ROOT, 'https://raw.githubusercontent.com/');
  });

  it('Defaults have correct types (boolean)', async () => {
    const action = { logger };
    await coerce(action);
    assert.equal(typeof action.secrets.TEST_BOOLEAN, 'boolean');
  });

  it('Secrets have correct types (boolean)', async () => {
    const action = { logger, secrets: { TEST_BOOLEAN: 'false' } };
    await coerce(action);
    assert.equal(action.secrets.TEST_BOOLEAN, false);
    assert.equal(typeof action.secrets.TEST_BOOLEAN, 'boolean');
  });
});
