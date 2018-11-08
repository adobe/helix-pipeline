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
const embed = require('../src/utils/embed-handler');

describe('Test Embed Handler', () => {
  it('Creates ESI', () => {
    const node = {
      type: 'embed',
      url: 'https://www.example.com/',
    };

    embed()((_, tagname, params, children) => {
      assert.equal(params.src, 'https://adobeioruntime.net/api/v1/web/helix/default/embed/https://www.example.com/');
      assert.equal(children, undefined);
      assert.equal(tagname, 'esi:include');
    }, node);
  });
});
