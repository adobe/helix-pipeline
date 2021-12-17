/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-disable global-require */
module.exports = [
  require('@adobe/helix-shared-config/src/schemas/markupconfig.schema.json'),
  require('@adobe/helix-shared-config/src/schemas/markup.schema.json'),
  require('@adobe/helix-shared-config/src/schemas/markupmapping.schema.json'),
  require('./action.schema.json'),
  require('./content.schema.json'),
  require('./context.schema.json'),
  require('./mdast.schema.json'),
  require('./meta.schema.json'),
  require('./position.schema.json'),
  require('./rawrequest.schema.json'),
  require('./request.schema.json'),
  require('./response.schema.json'),
  require('./secrets.schema.json'),
  require('./section.schema.json'),
  require('./textcoordinates.schema.json'),
];
