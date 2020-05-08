/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const { expand } = require('@emmetio/expand-abbreviation');
const { setdefault } = require('ferrum');
const findAndReplace = require('hast-util-find-and-replace');
const fromDOM = require('hast-util-from-dom');
const { JSDOM } = require('jsdom');
const { match: matchUrl } = require('path-to-regexp');
const { MarkupConfig } = require('@adobe/helix-shared');
const section = require('./section-handler');

/** Pleceholder variable for the generate template. */
const PLACEHOLDER_TEMPLATE = /\$\{\d+\}/g;

async function getMarkupConfig(context, action) {
  setdefault(context, 'content', {});

  const { logger, downloader } = action;
  const markupConfigTask = downloader.getTaskById('markupconfig');
  if (!markupConfigTask) {
    logger.info('unable to adjust markup. no markup config task scheduled.');
    return;
  }

  const res = await markupConfigTask;
  if (res.status !== 200) {
    logger.info(`unable to fetch markupconfig.yaml: ${res.status}`);
    return;
  }

  // remember markupconfig as source
  setdefault(context.content, 'sources', []).push(markupConfigTask.uri);

  // Expose markupconfig on the action
  const cfg = await new MarkupConfig()
    .withSource(res.body)
    .init();
  setdefault(action, 'markupconfig', cfg.toJSON());
}

/**
 * Returns the HTML element for the provided HTML template.
 *
 * @param {String} template The HTML template to use
 *
 * @returns {HTMLElement} the resulting HTML element including a `${0}` placeholder
 */
function getHTMLElement(template) {
  const html = expand(template, {
    field: (index, placeholder) => {
      const p = placeholder ? `:${placeholder}` : '';
      return `\${${index}${p}}`;
    },
  });
  const doc = new JSDOM().window.document;
  const dom = doc.createElement('div');
  dom.innerHTML = html;
  return dom.firstChild;
}

/**
 * Patches the specified VDOM element.
 *
 * @param {VDOM} el The VDOM element to patch
 * @param {*} cfg The configuration options
 * @returns {VDOM} the new patched element
 */
function patchVDOMNode(el, cfg) {
  setdefault(el, 'properties', {});

  // Append classes to the element (space or comma separated)
  if (cfg.classnames) {
    el.properties.className = [
      ...(el.properties.className || '').split(' '),
      ...cfg.classnames,
    ].join(' ').trim();
  }

  // Append attributes to the element
  if (cfg.attribute) {
    Object.assign(el.properties, cfg.attribute);
  }

  // Wrap the element
  if (cfg.wrap) {
    const wrapperEl = getHTMLElement(cfg.wrap);
    const n = fromDOM(wrapperEl);
    el = findAndReplace(n, PLACEHOLDER_TEMPLATE, () => el);
  }

  return el;
}

/**
 * Adjust the MDAST tree according to the markup config.
 * This is done by registering new matchers on the VDOMTransformer before the HTML
 * is generated in the pipeline
 *
 * @param {Object} context the execution context
 * @param {Object} logger the pipeline logger
 * @param {Object} transformer the VDOM transformer
 * @param {Object} markupconfig the markup config
 */
async function adjustMDAST(context, action) {
  // Since this is called first in the pipeline, we get the markup config here
  await getMarkupConfig(context, action);

  const { logger, transformer, markupconfig } = action;
  if (!markupconfig || !markupconfig.markup) {
    return;
  }

  const sectionHandler = section();
  Object.entries(markupconfig.markup)
    .filter(([_, cfg]) => cfg.type === 'url')
    .forEach(([name, cfg]) => {
      logger.info(`Applying markdown url adjustment: ${name}`);

      const match = matchUrl(cfg.match, { decode: decodeURIComponent });
      if (match(context.request.path)) {
        transformer.match('root', (h, node) => {
          // Generate the matching VDOM element
          const el = sectionHandler(h, { ...node, meta: {} });
          return patchVDOMNode(el, cfg);
        });
      }
    });

  Object.entries(markupconfig.markup)
    .filter(([_, cfg]) => cfg.type === 'markdown')
    .forEach(([name, cfg]) => {
      logger.info(`Applying markdown markup adjustment: ${name}`);

      transformer.match(cfg.match, (h, node) => {
        const handler = transformer.constructor.default(node);
        // Generate the matching VDOM element
        const el = handler(h, node);
        return patchVDOMNode(el, cfg);
      });
    });
}

/**
 * Adjust the DOM tree according to the markup config.
 * This is done by directly manipulating the DOM after it has been generated by the pipeline.
 *
 * @param {Object} context the execution context
 * @param {Object} logger the pipeline logger
 * @param {Object} markupconfig the markup config
 */
async function adjustHTML(context, { logger, markupconfig }) {
  if (!markupconfig || !markupconfig.markup) {
    return;
  }

  Object.entries(markupconfig.markup)
    .filter(([_, cfg]) => !cfg.type || cfg.type === 'html')
    .forEach(([name, cfg]) => {
      logger.info(`Applying HTML markup adjustment: ${name}`);

      const elements = context.content.document.querySelectorAll(cfg.match);
      elements.forEach((el) => {
        // Append classes to the element (space or comma separated)
        if (cfg.classnames) {
          el.classList.add(...cfg.classnames);
        }

        // Append attributes to the element
        if (cfg.attribute) {
          Object.entries(cfg.attribute).forEach((e) => el.setAttribute(e[0], e[1]));
        }

        // Wrap the element
        if (cfg.wrap) {
          const wrapperEl = getHTMLElement(cfg.wrap);
          wrapperEl.innerHTML = wrapperEl.innerHTML.replace(PLACEHOLDER_TEMPLATE, el.outerHTML);
          el.replaceWith(wrapperEl);
        }
      });
    });
}

module.exports = {
  adjustMDAST,
  adjustHTML,
};
