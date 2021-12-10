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
export function directives(expression = '') {
  const retval = expression.split(',')
    .map((s) => s.trim())
    .filter((s) => !!s)
    .map((s) => s.split('='))
    .map(([
      directive,
      value]) => [directive, Number.isNaN(Number.parseInt(value, 10))
      ? true
      : Number.parseInt(value, 10)])
    .reduce((obj, [directive, value]) => {
      obj[directive] = value;
      return obj;
    }, {});
  return retval;
}

export function format(dirs = {}) {
  return Object.entries(dirs)
    .map(([directive, value]) => ((value === true || value === 1) ? directive : `${directive}=${value}`))
    .join(', ');
}

export function merge(in1 = '', in2 = '') {
  const dirs1 = typeof in1 === 'string' ? directives(in1) : in1;
  const dirs2 = typeof in2 === 'string' ? directives(in2) : in2;

  const keys = [...Object.keys(dirs1), ...Object.keys(dirs2)];

  const mergeval = keys.reduce((merged, key) => {
    merged[key] = Math.min(
      dirs1[key] || Number.MAX_SAFE_INTEGER,
      dirs2[key] || Number.MAX_SAFE_INTEGER,
    );
    return merged;
  }, {});

  return typeof in1 === 'string' ? format(mergeval) : mergeval;
}
