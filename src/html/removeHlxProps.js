/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
function clean({ response }) {
  response.document.querySelectorAll('[class]').forEach((el) => {
    // Remove all `hlx-*` classes on the elements
    el.classList.value.split(' ')
      .filter((cls) => cls.indexOf('hlx-') === 0)
      .forEach((cls) => el.classList.remove(cls));
    if (!el.classList.length) {
      el.removeAttribute('class');
    }

    // Remove all `data-hlx-*` attributes on these elements
    Object.keys(el.dataset)
      .filter((key) => key.match(/^hlx[A-Z]/))
      .forEach((key) => delete el.dataset[key]);
  });
}

module.exports = clean;
