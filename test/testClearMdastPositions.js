/*
 * Copyright 2020 Adobe. All rights reserved.
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
const unified = require('unified');
const remark = require('remark-parse');
const { clearPositions } = require('../src/utils/clear-mdast-positions');

describe('Testing the clear MDAST position step', () => {
  let mdast;

  beforeEach(() => {
    mdast = unified().use(remark).parse('# Foo');
  });

  ['silly', 'trace', 'debug'].forEach((level) => {
    it(`keeps the position information if the logger is in '${level}' mode`, () => {
      const mockContext = {
        content: { mdast },
      };
      const mockAction = {
        logger: { level },
      };

      clearPositions(mockContext, mockAction);

      assert.ok(mockContext.content.mdast.position);
      assert.ok(mockContext.content.mdast.children[0].position);
    });
  });

  ['verbose', 'info', 'warn', 'error', 'fatal'].forEach((level) => {
    it(`removes the position information if the logger is in '${level}' mode`, () => {
      const mockContext = {
        content: { mdast },
      };
      const mockAction = {
        logger: { level },
      };

      clearPositions(mockContext, mockAction);

      assert.equal(mockContext.content.mdast.position, undefined);
      assert.equal(mockContext.content.mdast.children[0].position, undefined);
    });
  });
});
