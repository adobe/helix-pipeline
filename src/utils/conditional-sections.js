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
const hash = require('object-hash');

function selectstrain({ content }, { request, logger }) {
  // this only works when there are multiple sections and a strain has been chosen
  if (request.params
      && request.params.strain
      && content
      && content.sections
      && content.sections.length) {
    const { strain } = request.params;
    const { sections } = content;
    logger.debug(`Filtering sections not intended for strain ${strain}`);
    const remaining = sections.map((section) => {
      if (section.meta && section.meta.strain && Array.isArray(section.meta.strain)) {
        // this is a list of strains
        // return true if the selected strain is somewhere in the array
        return {
          meta: {
            type: 'array',
            hidden: !section.meta.strain.includes(strain),
          },
        };
      } else if (section.meta && section.meta.strain) {
        // we treat it as a string
        // return true if the selected strain is in the metadata
        return {
          meta: {
            type: 'string',
            hidden: !(section.meta.strain === strain),
          },
        };
      }
      // if there is no metadata, or no strain selection, just include it
      return {
        meta: {
          hidden: false,
        },
      };
    });
    logger.debug(`${remaining.length} Sections remaining`);
    return {
      content: {
        sections: remaining,
      },
    };
  }
  return {};
}

function testgroups(sections = []) {
  return sections
    .filter(({ meta = {} } = {}) => !!meta.test)
    .reduce((groups, section) => {
      /* eslint-disable no-param-reassign */
      if (groups[section.meta.test]) {
        groups[section.meta.test].push(section);
      } else {
        groups[section.meta.test] = [section];
      }
      /* eslint-enable no-param-reassign */
      return groups;
    }, {});
}

/**
 * Generate a stable sort order based on a random seed.
 * @param {String} strain random seed
 */
function strainhashsort(strain = 'default') {
  return function compare(left, right) {
    const lhash = hash({ strain, val: left });
    const rhash = hash({ strain, val: right });
    return lhash.localeCompare(rhash);
  };
}

function pick(groups = {}, strain = 'default') {
  return Object.keys(groups)
    .reduce((selected, group) => {
      const candidates = groups[group];
      candidates.sort(strainhashsort(strain));
      if (candidates.length) {
        /* eslint-disable-next-line no-param-reassign */
        [selected[group]] = candidates; // eslint prefers array destructing here
      }
      return selected;
    }, {});
}

function selecttest({ content }, { request, logger }) {
  if (request.params
    && request.params.strain
    && content
    && content.sections
    && content.sections.length) {
    const groups = testgroups(content.sections);
    const selected = pick(groups, request.params.strain);
    const remaining = content.sections.map((section) => {
      if (section.meta && section.meta.test) {
        return {
          meta: {
            type: 'string',
            hidden: !(section === selected[section.meta.test]),
          },
        };
      }
      return section;
    });

    logger.debug(`${remaining.length} Sections remaining`);
    return {
      content: {
        sections: remaining,
      },
    };
  }
  return {};
}

module.exports = {
  selectstrain,
  testgroups,
  selecttest,
  pick,
};
