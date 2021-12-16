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
import { logging } from '@adobe/helix-testutils';
import { assertEquals } from 'ferrum';
import selectStatus_ from '../src/xml/set-xml-status.js';

const selectStatus = (inProduction) => (context, env) => {
  // Mocking whether we are in production or not
  const old = process.env.__OW_ACTIVATION_ID;
  try {
    process.env.__OW_ACTIVATION_ID = inProduction ? 'mocked' : '';
    selectStatus_(context, env);
    return context;
  } finally {
    process.env.__OW_ACTIVATION_ID = old;
  }
};

const logger = logging.createTestLogger({
  // tune this for debugging
  level: 'info',
});

describe('Test set-xml-status', () => {
  const error = 'oh, no!';

  it('sets a verbose 500 for an error in dev', () => {
    const ctx = selectStatus(false)({ content: { }, error }, { logger });
    assertEquals(ctx.response.status, 500);
    assertEquals(ctx.response.body, `<?xml version="1.0" encoding="utf-8"?><error><code>500</code><message>${error}</message></error>`);
    assertEquals(ctx.response.headers['Content-Type'], 'application/xml');
  });

  it('sets a terse 500 for an error in production', () => {
    const ctx = selectStatus(true)({ content: { }, error }, { logger });
    assertEquals(ctx.response.status, 500);
    assertEquals(ctx.response.body, '');
  });

  it('sets a verbose 500 for an error in production if x-debug header is present', () => {
    const request = {
      headers: {
        'x-debug': 'true',
      },
    };
    const ctx = selectStatus(true)({ content: { }, error }, { logger, request });
    assertEquals(ctx.response.status, 500);
    assertEquals(ctx.response.body, `<?xml version="1.0" encoding="utf-8"?><error><code>500</code><message>${error}</message></error>`);
    assertEquals(ctx.response.headers['Content-Type'], 'application/xml');
  });

  it('keeps an existing status', () => {
    const ctx = selectStatus(false)({
      response: {
        status: 201,
      },
    }, { logger });
    assertEquals(ctx.response.status, 201);
  });

  it('sets a 200 if all good', () => {
    const ctx = selectStatus(false)(
      {
        content: {
          xml: {
            root: {},
          },
        },
      },
      { logger },
    );
    assertEquals(ctx.response.status, 200);
  });
});
