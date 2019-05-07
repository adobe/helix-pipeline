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
const stringify = require('../src/html/stringify-hast');

describe('Testing stringify pipeline step', () => {
  it('Simple HTML can be transformed', () => {
    assert.deepEqual(
      stringify({
        response: {
          hast: {
            type: 'root',
            children: [
              {
                type: 'element',
                tagName: 'html',
                properties: {},
                children: [
                  {
                    type: 'element',
                    tagName: 'head',
                    properties: {},
                    children: [
                      {
                        type: 'text',
                        value: '\n    ',
                        position: {
                          start: { line: 2, column: 9, offset: 15 },
                          end: { line: 3, column: 5, offset: 20 },
                        },
                      },
                      {
                        type: 'element',
                        tagName: 'title',
                        properties: {},
                        children: [
                          {
                            type: 'text',
                            value: 'Foo',
                            position: {
                              start: { line: 3, column: 12, offset: 27 },
                              end: { line: 3, column: 15, offset: 30 },
                            },
                          },
                        ],
                        position: {
                          start: { line: 3, column: 5, offset: 20 },
                          end: { line: 3, column: 23, offset: 38 },
                        },
                      },
                      {
                        type: 'text',
                        value: '\n  ',
                        position: {
                          start: { line: 3, column: 23, offset: 38 },
                          end: { line: 4, column: 3, offset: 41 },
                        },
                      },
                    ],
                    position: {
                      start: { line: 2, column: 3, offset: 9 },
                      end: { line: 4, column: 10, offset: 48 },
                    },
                  },
                  {
                    type: 'text',
                    value: '\n  ',
                    position: {
                      start: { line: 4, column: 10, offset: 48 },
                      end: { line: 5, column: 3, offset: 51 },
                    },
                  },
                  {
                    type: 'element',
                    tagName: 'body',
                    properties: {},
                    children: [
                      {
                        type: 'text',
                        value: 'bar\n',
                        position: {
                          start: { line: 5, column: 10, offset: 58 },
                          end: { line: 6, column: 1, offset: 69 },
                        },
                      },
                    ],
                  },
                ],
                position: {
                  start: { line: 1, column: 1, offset: 0 },
                  end: { line: 6, column: 8, offset: 76 },
                },
              },
            ],
            data: { quirksMode: true },
            position: {
              start: { line: 1, column: 1, offset: 0 },
              end: { line: 6, column: 8, offset: 76 },
            },
          },
        },
      }).response.body,
      `<html><head>
    <title>Foo</title>
  </head>
  <body>bar
</body></html>`,
    );
  });
});
