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
const link = require('../src/utils/link-handler');

const logger = winston.createLogger({
  // tune this for debugging
  level: 'debug',
  // and turn this on if you want the output
  silent: true,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

const action = { logger, secrets: { } };

describe('Test Link Handler', () => {
  // test link rewriting
  [
    {
      title: 'Rewrites .md extension to .html',
      originalUrl: '/test.md',
      expectedUrl: '/test.html',
    },
    {
      title: 'Does not alter URL with non .md extension',
      originalUrl: '/test.png',
      expectedUrl: '/test.png',
    },
    {
      title: 'Does not lose query string while rewriting',
      originalUrl: '/test.md?bla',
      expectedUrl: '/test.html?bla',
    },
    {
      title: 'Does not lose hash while rewriting',
      originalUrl: '/test.md#bla',
      expectedUrl: '/test.html#bla',
    },
    {
      title: 'Ignores URL will protocol',
      originalUrl: 'https://www.example.com/test.md',
      expectedUrl: 'https://www.example.com/test.md',
    },
  ].forEach((testCase) => {
    it(testCase.title, () => {
      const node = {
        type: 'link',
        url: testCase.originalUrl,
      };

      link(action.secrets)((_, tagName, parameters) => {
        assert.equal(parameters.href, testCase.expectedUrl);
        assert.equal(tagName, 'a');
      }, node);
    });
  });
});
