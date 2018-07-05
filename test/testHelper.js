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

const helper = require('../src/helper');
const assert = require('assert');
const winston = require('winston');

const logger = winston.createLogger({
  // tune this for debugging
  level: 'debug',
  // and turn this on if you want the output
  silent: true,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ],
});


describe('Test bail', () => {
  it('Bail returns an error', () => {
    assert.equal(helper.bail(logger, 'This is bad').error.message, 'This is bad');
  });

  it('Bail logs something', (done) => {
    helper.bail({ error: () => { done(); } }, 'This is bad');
  });
});
