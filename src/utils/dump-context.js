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

const path = require('path');
const fs = require('fs-extra');

function tstamp() {
  const now = new Date();
  let retstr = '';
  retstr += (`${now.getFullYear()}`).padStart(4, '0');
  retstr += (`${now.getUTCMonth()}`).padStart(2, '0');
  retstr += (`${now.getUTCDate()}`).padStart(2, '0');
  retstr += '-';

  retstr += (`${now.getUTCHours()}`).padStart(2, '0');
  retstr += (`${now.getUTCMinutes()}`).padStart(2, '0');
  retstr += '-';

  retstr += (`${now.getUTCSeconds()}`).padStart(2, '0');
  retstr += '.';
  retstr += (`${now.getUTCMilliseconds()}`).padStart(4, '0');

  return retstr;
}

async function dump(context, action, index) {
  const nowStr = tstamp();
  // eslint-disable-next-line no-param-reassign
  action.debug = action.debug || {};
  if (!action.debug.dumpDir) {
    const id = (context.request && context.request.headers && context.request.headers['x-openwhisk-activation-id']) || '';
    const pathStr = context.request && context.request.path ? context.request.path.replace(/\//g, '-').substring(1) : '';
    const dirName = `context_dump_${pathStr}_${nowStr}_${id}`;
    // eslint-disable-next-line no-param-reassign
    action.debug.dumpDir = path.resolve(process.cwd(), 'logs', 'debug', dirName);
    await fs.ensureDir(action.debug.dumpDir);
  }

  const dumppath = path.resolve(action.debug.dumpDir, `context-${nowStr}-step-${index}.json`);
  await fs.writeJson(dumppath, context, { spaces: 2 });
  return dumppath;
}

module.exports = dump;
