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
import production from '../src/utils/is-production.js';

describe('Test Check for Production Environment', () => {
  it('Detects production environment', () => {
    // eslint-disable-next-line no-underscore-dangle
    process.env.__OW_ACTIVATION_ID = 'foo';
    assert.ok(production());
    // eslint-disable-next-line no-underscore-dangle
    delete process.env.__OW_ACTIVATION_ID;
  });

  it('Detects production environment in uncooperative situations', () => {
    const oldenv = { ...process.env };

    // trying to reproduce a really odd exception we are seeing in production.
    process.env = {
      // eslint-disable-next-line no-underscore-dangle
      get __OW_ACTIVATION_ID() {
        // eslint-disable-next-line no-underscore-dangle
        return null.__OW_ACTIVATION_ID;
      },
    };

    assert.ok(production());
    // eslint-disable-next-line no-underscore-dangle
    process.env = oldenv;
  });

  it('Detects non-production environment', () => {
    assert.ok(!production());
  });
});
