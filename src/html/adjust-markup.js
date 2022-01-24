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
import { expand } from '@emmetio/expand-abbreviation';
import { setdefault } from 'ferrum';
import { fromDom } from 'hast-util-from-dom';
import { JSDOM } from 'jsdom';
import { match as matchUrlBuilder } from 'path-to-regexp';
import { MarkupConfig } from '@adobe/helix-shared-config';
import { visit } from 'unist-util-visit';
import { getProperty as get } from 'dot-prop';
import { match } from '../utils/pattern-compiler.js';
import section from '../utils/section-handler.js';
import VDOMTransformer from '../utils/mdast-to-vdom.js';

/** Placeholder variable for the generate template. */
const PLACEHOLDER_TEMPLATE = /\$\{\d+\}/g;

function findAndReplace(root, insert) {
  visit(root, (node) => node.type === 'text' && node.value && node.value.match(PLACEHOLDER_TEMPLATE), (_, index, parent) => {
    const newels = Array.isArray(insert) ? insert : [insert];

    parent.children.splice(index, 1, ...newels);
  });

  return root;
}

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
    logger.info(`unable to fetch helix-markup.yaml: ${res.status}`);
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
 * Checks whether the given mdast node is a section.
 *
 * @param {MDAST} node the mdast node to check
 * @returns {boolean} `true` if the node is a section, `false` otherwise
 */
function isSection(node) {
  return node.type === 'root' || node.type === 'section';
}

function populate(template, data) {
  const mod = template.replace(/\${([A-Za-z0-9.]+)}/g, (_, prop) => get(data, prop));
  return mod;
}

/**
 * Returns the HTML element for the provided HTML template.
 *
 * @param {String} template The HTML template to use
 *
 * @returns {HTMLElement} the resulting HTML element including a `${0}` placeholder
 */
function getHTMLElement(template, data) {
  const html = expand(populate(template, data), {
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
function patchVDOMNode(el, cfg, data) {
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
    const wrapperEl = getHTMLElement(cfg.wrap, data);
    const n = fromDom(wrapperEl);
    el = findAndReplace(n, el);
  }

  // Replace the element
  if (cfg.replace) {
    const wrapperEl = getHTMLElement(cfg.replace, data);
    const n = fromDom(wrapperEl);
    el = findAndReplace(n, { type: 'text', value: '' });
  }

  return el;
}

function patchVDOMNodes(els, cfg, data) {
  if (!Array.isArray(els)) {
    return patchVDOMNode(els, cfg, data);
  }

  const copycfg = { ...cfg };
  delete copycfg.wrap;

  const patched = els.map((el) => patchVDOMNode(el, copycfg, data));

  // Wrap the element
  if (cfg.wrap) {
    const wrapperEl = getHTMLElement(cfg.wrap, data);
    const n = fromDom(wrapperEl);
    return findAndReplace(n, patched);
  }

  return patched;
}

/**
 * Patches the specified html element.
 *
 * @param {HTMLElement} el The html element to patch
 * @param {*} cfg The configuration options
 */
function patchHtmlElement(el, cfg) {
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
    const wrapperEl = getHTMLElement(cfg.wrap, el);
    // if it is a regular element
    if (el.nodeName !== 'BODY') {
      wrapperEl.innerHTML = wrapperEl.innerHTML.replace(PLACEHOLDER_TEMPLATE, el.outerHTML);
      el.replaceWith(wrapperEl);
    } else { // ... but just merge the properties on the BODY
      [...wrapperEl.attributes].forEach((attr) => {
        el.parentNode.setAttribute(attr.name, attr.value);
      });
    }
  }

  // Replace the element
  if (cfg.replace) {
    const wrapperEl = getHTMLElement(cfg.replace, el);
    wrapperEl.innerHTML = wrapperEl.innerHTML.replace(PLACEHOLDER_TEMPLATE, '');
    el.replaceWith(wrapperEl);
  }
}

/**
 * Adjust the MDAST conversion according to the markup config.
 * This is done by registering new matchers on the VDOMTransformer before the VDOM
 * is generated in the pipeline
 *
 * @param {Object} context the execution context
 * @param {Object} logger the pipeline logger
 * @param {Object} transformer the VDOM transformer
 * @param {Object} markupconfig the markup config
 */
export async function adjustMDAST(context, action) {
  // Since this is called first in the pipeline, we get the markup config here
  await getMarkupConfig(context, action);

  const { logger, transformer, markupconfig } = action;
  if (!markupconfig || !markupconfig.markup) {
    return;
  }

  // Adjust the MDAST conversion based on markdown config
  Object.entries(markupconfig.markup)
    .filter(([_, cfg]) => cfg.type === 'markdown')
    .forEach(([name, cfg]) => {
      logger.info(`Applying markdown markup adjustment: ${name}`);
      transformer.match(cfg.match, function myhandler(h, node, parent) {
        const [fallbackhandler] = transformer
          .allmatches(node)
          .filter((theirhandler) => theirhandler !== myhandler);
        // Generate the matching VDOM element

        /**
         * A function that enables the recursive processing of MDAST child nodes
         * in handler functions.
         * @param {function} callback the HAST-constructing callback function
         * @param {Node} childnode the MDAST child node that should be handled
         * @param {Node} mdastparent the MDAST parent node, usually the current MDAST node
         * processed by the handler function
         * @param {*} hastparent the HAST parent node that the transformed child will be appended to
         */
        function handlechild(callback, childnode, mdastparent, hastparent) {
          if (hastparent && hastparent.children) {
            hastparent.children.push(VDOMTransformer.handle(
              callback,
              childnode,
              mdastparent,
              transformer,
            ));
          }
        }

        const el = fallbackhandler(h, node, parent, handlechild);

        return patchVDOMNodes(el, cfg, node);
      });
    });

  // Adjust the MDAST conversion based on content config
  Object.entries(markupconfig.markup)
    .filter(([_, cfg]) => cfg.type === 'content')
    .forEach(([name, cfg]) => {
      logger.info(`Applying content intelligence adjustment: ${name}`);
      transformer.match((node) => {
        const childtypes = node.children
          ? node.children.map((n) => n.type).filter((type) => !!type)
          : [];
        return isSection(node) && match(childtypes, cfg.match);
      }, (h, node) => {
        // Generate the matching VDOM element
        const sectionHandler = section();
        const el = sectionHandler(h, node);
        return patchVDOMNode(el, cfg, node);
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
export async function adjustHTML(context, { logger, markupconfig }) {
  if (!markupconfig || !markupconfig.markup) {
    return;
  }

  Object.entries(markupconfig.markup)
    .filter(([_, cfg]) => !cfg.type || cfg.type === 'url')
    .forEach(([name, cfg]) => {
      logger.info(`Applying URL markup adjustment: ${name}`);
      const matchUrl = matchUrlBuilder(cfg.match, { decode: decodeURIComponent });
      if (matchUrl(context.request.path)) {
        patchHtmlElement(context.content.document.body, cfg);
      }
    });

  Object.entries(markupconfig.markup)
    .filter(([_, cfg]) => !cfg.type || cfg.type === 'html')
    .forEach(([name, cfg]) => {
      logger.info(`Applying HTML markup adjustment: ${name}`);
      const elements = context.content.document.querySelectorAll(cfg.match);
      elements.forEach((el) => patchHtmlElement(el, cfg));
    });
}
