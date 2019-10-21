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

const hash = require("object-hash");
const { setdefault, type, each } = require("ferrum");

function selectstrain(context, { request, logger }) {
  const cont = setdefault(context, "content", { mdast: {} });
  const params = request.params || {};
  const { strain } = params;
  const sections = cont.mdast.children;

  if (!strain || !sections) {
    return;
  }

  logger.debug(`Filtering sections not intended for strain ${strain}`);
  each(sections, section => {
    const meta = setdefault(section, "meta", {});
    const strainList =
      type(meta.strain) === Array ? meta.strain : [meta.strain];
    meta.hidden = Boolean(
      meta.strain && meta.strain !== [] && !strainList.includes(strain)
    );
  });
}

function testgroups(sections = []) {
  return sections
    .filter(({ meta = {} } = {}) => !!meta.test)
    .reduce((groups, section) => {
      if (groups[section.meta.test]) {
        groups[section.meta.test].push(section);
      } else {
        groups[section.meta.test] = [section];
      }
      return groups;
    }, {});
}

/**
 * Generate a stable sort order based on a random seed.
 * @param {String} strain random seed
 */
function strainhashsort(strain = "default") {
  return function compare(left, right) {
    const lhash = hash({ strain, val: left });
    const rhash = hash({ strain, val: right });
    return lhash.localeCompare(rhash);
  };
}

function pick(groups = {}, strain = "default") {
  return Object.keys(groups).reduce((selected, group) => {
    const candidates = groups[group];
    candidates.sort(strainhashsort(strain));
    if (candidates.length) {
      [selected[group]] = candidates; // eslint prefers array destructing here
    }
    return selected;
  }, {});
}

function selecttest(context, { request }) {
  const cont = setdefault(context, "content", { mdast: {} });
  const params = request.params || {};
  const { strain } = params;
  const sections = cont.mdast.children;

  if (!strain || !sections) {
    return;
  }

  const selected = pick(testgroups(sections), strain);
  each(sections, section => {
    if (!section.meta || !section.meta.test) {
      return;
    }

    section.meta.hidden = !(section === selected[section.meta.test]);
  });
}

module.exports = {
  selectstrain,
  testgroups,
  selecttest,
  pick
};
