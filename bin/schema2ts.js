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

/* eslint-disable import/no-extraneous-dependencies */
const { compileFromFile } = require('json-schema-to-typescript');
const { writeFileSync } = require('fs-extra');
const fs = require('fs-extra');

const options = {
  $refOptions: {
    dereference: {
      declareExternallyReferenced: false,
      circular: true, // Don't allow circular $refs
    },
    resolve: {
      custom: {
        order: 1,
        canRead({ url }) {
          const basename = url.split('/').pop();
          return fs.existsSync(`./docs/${basename}.schema.json`);
        },
        read({ url }, callback) {
          const basename = url.split('/').pop();
          let schema = fs.readFileSync(`./docs/${basename}.schema.json`);
          if (url === 'https://ns.adobe.com/helix/pipeline/mdast') {
            schema = schema.toString().replace('"$ref": "https://ns.adobe.com/helix/pipeline/mdast"', '"type": "object"');
          }
          callback(null, schema);
        },
      },
    },
  },
  bannerComment: `/*
  * Copyright 2018 Adobe. All rights reserved.
  * This file is licensed to you under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License. You may obtain a copy
  * of the License at http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software distributed under
  * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  * OF ANY KIND, either express or implied. See the License for the specific language
  * governing permissions and limitations under the License.
  */`,
};

compileFromFile('docs/context.schema.json', options).then(ts => writeFileSync('src/context.d.ts', ts));
compileFromFile('docs/action.schema.json', options).then(ts => writeFileSync('src/action.d.ts', ts));
