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
    const remaining = sections.filter((section) => {
      if (section.meta && section.meta.strain && Array.isArray(section.meta.strain)) {
        // this is a list of strains
        // return true if the selected strain is somewhere in the array
        return section.meta.strain.includes(strain);
      } if (section.meta && section.meta.strain) {
        // we treat it as a string
        // return true if the selected strain is in the metadata
        return section.meta.strain === strain;
      }
      // if there is no metadata, or no strain selection, just include it
      return true;
    });
    logger.debug(`${remaining.length}Sections remaining`);
    return {
      content: {
        sections: remaining,
      },
    };
  }
  return {};
}

module.exports.selectstrain = selectstrain;
