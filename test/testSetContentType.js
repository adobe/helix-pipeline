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
const setcontenttype = require('../src/html/set-content-type.js');

const logger = winston.createLogger({
  // tune this for debugging
  level: 'debug',
  // and turn this on if you want the output
  silent: true,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

describe('Test set-content-type', () => {
  it('sets a missing content type', () => {
    assert.deepEqual(
      setcontenttype({}, { logger }),
      {
        response: {
          headers: {
            'Content-Type': 'text/html',
          },
        },
      },
    );
  });
  it('sets keeps content type', () => {
    assert.deepEqual(
      setcontenttype({
        response: {
          headers: {
            'Content-Type': 'text/plain',
          },
        },
      }, { logger }),
      {},
    );
  });
});
