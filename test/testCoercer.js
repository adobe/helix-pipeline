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
const winston = require('winston');
const coerce = require('../src/utils/coerce-secrets');

const logger = winston.createLogger({
  // tune this for debugging
  level: 'debug',
  // and turn this on if you want the output
  silent: false,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
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

  it('Defaults have correct types (number)', async () => {
    const action = { logger };
    await coerce(action);
    assert.ok(action.secrets.IMAGES_MAX_SIZE);
    assert.equal(action.secrets.IMAGES_MAX_SIZE, 4096);
    assert.equal(typeof action.secrets.IMAGES_MAX_SIZE, 'number');
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

  it('Secrets have correct types (number)', async () => {
    const action = { logger, secrets: { IMAGES_MAX_SIZE: '4000' } };
    await coerce(action);
    assert.equal(action.secrets.IMAGES_MAX_SIZE, 4000);
    assert.equal(typeof action.secrets.IMAGES_MAX_SIZE, 'number');
  });
});
