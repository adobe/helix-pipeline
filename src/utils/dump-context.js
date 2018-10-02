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

const tmp = require('tmp-promise');
const path = require('path');
const fs = require('fs-extra');

fs.mkdirpSync(path.resolve(process.cwd(), 'debug'));
const dumpdir = tmp.dir({ prefix: 'context_dump_', dir: path.resolve(process.cwd(), 'debug'), unsafeCleanup: true }).then(o => o.path);

function dump(context, _, index) {
  return Promise.resolve(dumpdir).then((dir) => {
    const now = new Date();
    const dumppath = path.resolve(dir, `context-${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDay()}-${now.getUTCHours()}-${now.getUTCMinutes()}-${now.getUTCSeconds()}.${now.getUTCMilliseconds()}-step-${index}.json`);
    fs.writeJsonSync(dumppath, context, { spaces: 2 });
    return dumppath;
  });
}

module.exports = dump;
