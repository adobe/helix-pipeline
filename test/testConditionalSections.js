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
const { strain } = require('../src/utils/conditional-sections');

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

describe('Unit Test Section Strain Filtering', () => {
  it('Works with empty section lists', () => {
    const context = {
      content: {
        sections: [],
      },
    };
    const action = {
      request: {
        params: {
          strain: 'empty',
        },
      },
    };
    const result = strain(context, action);
    assert.deepStrictEqual(result, {});
  });

  it('Filters sections based on strain', () => {
    const context = {
      content: {
        sections: [
          { meta: { strain: 'test' } },
          { meta: { strain: 'test' } },
          { meta: { strain: 'no-test' } },
        ],
      },
    };
    const action = {
      request: {
        params: {
          strain: 'test',
        },
      },
      logger,
    };
    const result = strain(context, action);
    assert.equal(result.content.sections.length, 2);
  });

  it('Filters sections based on strain (array)', () => {
    const context = {
      content: {
        sections: [
          { meta: { strain: 'test' } },
          { meta: { strain: ['test', 'no-test'] } },
          { meta: { strain: 'no-test' } },
        ],
      },
    };
    const action = {
      request: {
        params: {
          strain: 'test',
        },
      },
      logger,
    };
    const result = strain(context, action);
    assert.equal(result.content.sections.length, 2);
  });


  it('Keeps sections without a strain', () => {
    const context = {
      content: {
        sections: [
          { meta: { strain: 'test' } },
          { meta: { strain: ['test', 'no-test'] } },
          { meta: {} },
        ],
      },
    };
    const action = {
      request: {
        params: {
          strain: 'no-test',
        },
      },
      logger,
    };
    const result = strain(context, action);
    assert.equal(result.content.sections.length, 2);
  });

  it('Keeps sections without metadata', () => {
    const context = {
      content: {
        sections: [
          { meta: { strain: 'test' } },
          { meta: { strain: ['test', 'no-test'] } },
          {},
        ],
      },
    };
    const action = {
      request: {
        params: {
          strain: 'no-test',
        },
      },
      logger,
    };
    const result = strain(context, action);
    assert.equal(result.content.sections.length, 2);
  });
});
