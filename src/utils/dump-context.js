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
const { setdefault } = require('ferrum');

/**
 * Returns {@code true} if context dumps should never be written to disk.
 * @returns {boolean} {@code true} if writing dumps is disabled.
 */
function disableDisk() {
  // if we run in openwhisk, we never want files to be written to disk.
  return !!process.env.__OW_ACTIVATION_ID;
}

/**
 * Creates a timestamp string of the given date.
 * @param {Date} now the time
 * @returns {string} a timestamp string
 */
function tstamp(now) {
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

/**
 * Ensures that the dump directory exists.
 * @param {*} context Pipeline context
 * @param {*} action Pipeline action
 */
async function ensureDumpDir(context, action) {
  if (action.debug.dumpDir) {
    return;
  }
  const stamp = tstamp(new Date());
  const id = (context.request && context.request.headers && context.request.headers['x-openwhisk-activation-id']) || '';
  const pathStr = context.request && context.request.path ? context.request.path.replace(/\//g, '-').substring(1) : '';
  const dirName = `context_dump_${stamp}_${pathStr}_${id}`;
  action.debug.dumpDir = path.resolve(process.cwd(), 'logs', 'debug', dirName);
  await fs.ensureDir(action.debug.dumpDir);
  action.logger.info(`Writing context dumps to: ${action.debug.dumpDir}`);
}

/**
 * Writes the context dump to a file. If the dump directory doesn't exists, it will be created.
 * @param {*} context Pipeline context
 * @param {*} action Pipeline action
 * @param {*} info The context dump information
 */
async function writeDump(context, action, info) {
  const stamp = tstamp(info.time);
  const fileName = `context-${stamp}-step-${info.index}-${info.name}.json`;
  info.file = path.resolve(action.debug.dumpDir, fileName);
  action.logger.silly(`writing context dump ${fileName}`);
  return fs.writeFile(info.file, info.json, 'utf-8');
}

/**
 * Records the current context dump in the {@code action.debug.contextDumps} array.
 * If the log level is set to {@code silly}, the dump will also be written to disk using
 * {@link #writeDump}.
 *
 * @param {*} context Pipeline context
 * @param {*} action Pipeline action
 * @param {number} index The index of the current pipeline step
 * @param {string} name The name of the current pipeline step
 */
async function record(context, action, index, name) {
  const debug = setdefault(action, 'debug', { contextDumps: [] });
  const info = {
    index,
    name: name ? name.split(':').pop() : 'undef',
    time: new Date(),
    json: JSON.stringify(context, null, 2),
  };
  debug.contextDumps.push(info);

  if (action.logger.level === 'silly' && !disableDisk()) {
    await ensureDumpDir(context, action);
    await writeDump(context, action, info);
  }
}

/**
 * Writes the collected context dumps to disk
 * @param {*} context Pipeline context
 * @param {*} action Pipeline action
 */
async function report(context, action) {
  if (action.logger.level === 'silly' || disableDisk()) {
    return;
  }
  await ensureDumpDir(context, action);
  await Promise.all(action.debug.contextDumps.map((info) => writeDump(context, action, info)));
}

module.exports = {
  record,
  report,
};
