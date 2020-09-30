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
const { inspect } = require('util');
const URI = require('uri-js');
const { setdefault } = require('ferrum');
const fetchAPI = require('@adobe/helix-fetch');

const DEFAULT_FORWARD_HEADERS = [
  'x-request-id',
  'x-cdn-request-id',
  'x-cdn-url',
  'x-ow-version-lock',
];

class Downloader {
  constructor(context, action, options = {}) {
    this._context = context;
    this._action = action;
    this._queue = [];
    this._forceNoCache = options.forceNoCache || false;

    const { logger, secrets } = this._action;
    if (!secrets || !secrets.HTTP_TIMEOUT) {
      logger.warn('No HTTP timeout set, risk of denial-of-service');
    }
    if (options.forceHttp1 || process.env.HELIX_PIPELINE_FORCE_HTTP1) {
      this._fetchContext = fetchAPI.context({
        httpProtocol: 'http1',
        httpsProtocols: ['http1'],
      });
    } else {
      this._fetchContext = fetchAPI;
    }
    this._client = this._fetchContext.fetch;
  }

  get tasks() {
    return this._queue;
  }

  get githubRootPath() {
    return this._action.secrets.REPO_RAW_ROOT;
  }

  get timeout() {
    return this._action.secrets.HTTP_TIMEOUT;
  }

  get githubToken() {
    const { request = {}, secrets } = this._action;
    return (secrets && secrets.GITHUB_TOKEN) || (request.headers ? request.headers['x-github-token'] : '');
  }

  computeGithubURI(owner, repo, ref, path) {
    const rootURI = URI.parse(this.githubRootPath);
    const rootPath = rootURI.path;
    // remove double slashes
    const fullPath = `${rootPath}/${owner}/${repo}/${ref}/${path}`.replace(
      /\/+/g,
      '/',
    );

    return URI.serialize({
      scheme: rootURI.scheme,
      host: rootURI.host,
      port: rootURI.port,
      path: fullPath,
    });
  }

  /**
   * Schedules a task that fetches a web resource.
   * @param {object} opts options.
   * @param {object} opts.uri URI to download
   * @param {object} opts.options Fetch options passed to the underlying helix-fetch.
   * @param {string} opts.id Some id to later identify the task.
   * @param {number} opts.timeout Override global timeout
   * @param {boolean} opts.errorOn404 Treat 404 as error.
   * @param {string[]} opts.forwardHeaders Names of headers that are forwarded.
   * Default `['x-request-id', 'x-cdn-request-id', 'x-cdn-url']`
   * @return {Promise} Promise that resolves with the response.
   */

  fetch(opts) {
    const { request = {}, logger } = this._action;
    const context = this._context;

    const { uri, options = {} } = opts;
    if (!uri) {
      throw new Error('Unknown uri, cannot fetch content');
    }

    if (!('timeout' in options)) {
      options.timeout = this.timeout;
    }

    if (!('cache' in options)) {
      options.cache = request.headers ? request.headers['Cache-Control'] : '';
    }
    if (this._forceNoCache) {
      options.cache = 'no-store';
    }

    options.headers = options.headers || {};
    if (request.headers) {
      const forwardHeaders = opts.forwardHeaders || DEFAULT_FORWARD_HEADERS;
      if (forwardHeaders.length > 0) {
        forwardHeaders.forEach((header) => {
          header = header.toLowerCase();
          if (request.headers[header]) {
            options.headers[header] = request.headers[header];
          }
        });
      }
    }
    // include transaction id if not already present
    if (!options.headers['x-request-id']
      && process.env.__OW_TRANSACTION_ID) {
      options.headers['x-request-id'] = process.env.__OW_TRANSACTION_ID;
    }

    const download = async () => {
      logger.debug(`fetching file from ${uri}`);
      let res = {};
      const { AbortError, timeoutSignal } = this._fetchContext;
      const { timeout } = options;
      if (timeout) {
        delete options.timeout;
        options.signal = timeoutSignal(timeout);
      }
      try {
        res = await this._client(uri, options);
        const body = await res.text();
        if (res.ok) {
          return {
            status: res.status,
            body,
            headers: res.headers,
          };
        }
      } catch (e) {
        res = e;
        res.ok = false;
      }

      if (res.status === 404) {
        if (!opts.errorOn404) {
          logger.info(`Could not find file at ${uri}`);
          res.body = 'not found';
          return res;
        }
        logger.warn(`Could not find file at ${uri}`);
        setdefault(context, 'response', {}).status = 404;
      } else if (res.status === 502 || res instanceof AbortError) {
        logger.error(`Gateway timeout of ${timeout} milliseconds exceeded for ${uri}`);
        setdefault(context, 'response', {}).status = 504;
      } else {
        logger.error(`Error while fetching file from ${uri} with the following options:\n${inspect(options, { depth: null })}`);
        setdefault(context, 'response', {}).status = 502;
      }

      let err = res;
      if (!(err instanceof Error)) {
        err = Error(`Error while fetching file from ${uri}: ${res.status}`);
      }
      err.status = res.status || 500;
      context.error = {
        message: err.message,
        status: err.status,
        stack: err.stack,
      };
      throw err;
    };

    const task = download();
    task.uri = uri;
    task.id = opts.id || '';
    task.options = opts;

    this._queue.push(task);
    return task;
  }

  /**
   * Schedules a task that fetches a file from github.
   *
   * @param {object} opts Options.
   * @param {string} opts.owner Repository owner
   * @param {string} opts.repo Repository name
   * @param {string} opts.ref Repository ref (e.g. master or sha)
   * @param {string} opts.path Path of the file to fetch
   * @param {number} opts.timeout Override global timeout
   * @param {string} opts.id Some id to later identify the task.
   * @param {boolean} opts.errorOn404 Treat 404 as error.
   *
   * @return {Promise} Promise that resolves with the fetch result.
   */
  fetchGithub(opts) {
    // prepare request options
    const { logger } = this._action;
    const options = {};

    // if there is a github token, send it in the Authorization header
    const token = this.githubToken;
    if (token) {
      setdefault(options, 'headers', {
        Authorization: `token ${token}`,
      });
    }

    // get required request parameters
    const {
      owner, repo, ref, path,
    } = opts;

    // bail if a required parameter cannot be found
    if (!owner) {
      throw new Error('Unknown owner, cannot fetch content');
    }
    if (!repo) {
      throw new Error('Unknown repo, cannot fetch content');
    }
    if (!path) {
      throw new Error('Unknown path, cannot fetch content');
    }
    if (!ref) {
      logger.warn(`Recoverable error: no ref given for ${repo}/${owner}.git${path}, falling back to master`);
    }

    const uri = this.computeGithubURI(owner, repo, ref || 'master', path);

    return this.fetch({
      uri,
      options,
      id: opts.id || '',
      errorOn404: opts.errorOn404 || false,
      forwardHeaders: [],
    });
  }

  /**
   * Returns the task with the specified id.
   * @param {string} id task id.
   * @returns {object} Task or null, if not found.
   */
  getTaskById(id) {
    return this._queue.find((task) => (task.id === id));
  }

  /**
   * disconnect clients
   */
  destroy() {
    this._fetchContext.disconnectAll();
  }
}

module.exports = Downloader;
