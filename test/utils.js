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

const path = require('path');
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');
const { setupMocha } = require('@pollyjs/core');
const { VersionLock } = require('@adobe/openwhisk-action-utils');
const { pipe: htmlPipe } = require('../src/defaults/html.pipe.js');
const { pipe: jsonPipe } = require('../src/defaults/json.pipe.js');
const { pipe: xmlPipe } = require('../src/defaults/xml.pipe.js');
const Downloader = require('../src/utils/Downloader.js');

function piper(pipe) {
  return (cont, context, action) => {
    action.downloader = new Downloader(context, action, { forceHttp1: true });
    action.versionLock = new VersionLock();
    return pipe(cont, context, action);
  };
}

function setupPolly(opts) {
  setupMocha({
    logging: false,
    recordFailedRequests: true,
    recordIfMissing: false,
    matchRequestsBy: {
      headers: {
        exclude: ['authorization', 'accept-encoding', 'user-agent', 'accept', 'connection', 'x-request-id'],
      },
    },
    adapters: [NodeHttpAdapter],
    persister: FSPersister,
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, 'fixtures'),
      },
    },
    ...opts,
  });
}

module.exports = {
  pipe: piper(htmlPipe),
  jsonPipe: piper(jsonPipe),
  xmlPipe: piper(xmlPipe),
  setupPolly,
};
