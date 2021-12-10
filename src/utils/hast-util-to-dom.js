/*
 * (ISC License)
 *
 * Copyright (c) 2018 Keith McKnight <keith@mcknig.ht>
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
 * THIS SOFTWARE.
 */

// This was copied from https://github.com/syntax-tree/hast-util-to-dom/blob/master/src/index.js
// and adapted so that it can be used with JSDOM
// TODO: contribute back to original

/* eslint-disable header/header */
import info from 'property-information';

const ns = {
  html: 'http://www.w3.org/1999/xhtml',
};
/* istanbul ignore next */
const wrap = (document) => {
  // Add all children.
  function appendAll(node, children, options) {
    const childrenLength = children.length;

    for (let i = 0; i < childrenLength; i += 1) {
      // eslint-disable-next-line no-use-before-define
      node.appendChild(transform(children[i], options));
    }

    return node;
  }

  // Create a document.
  function root(node, options) {
    const { fragment, namespace: optionsNamespace } = options;
    const { children = [] } = node;
    const { length: childrenLength } = children;

    let namespace = optionsNamespace;
    let rootIsDocument = childrenLength === 0;

    for (let i = 0; i < childrenLength; i += 1) {
      const { tagName, properties = {} } = children[i];

      if (tagName === 'html') {
        // If we have a root HTML node, we don’t need to render as a fragment.
        rootIsDocument = true;

        // Take namespace of the first child.
        if (typeof optionsNamespace === 'undefined') {
          namespace = properties.xmlns || ns.html;
        }
      }
    }

    // The root node will be a Document, DocumentFragment, or HTMLElement.
    let el;

    if (rootIsDocument) {
      el = document.implementation.createDocument(namespace, '', null);
    } else if (fragment) {
      el = document.createDocumentFragment();
    } else {
      el = document.createElement('html');
    }

    return appendAll(el, children, { fragment, namespace, ...options });
  }

  // Create a `doctype`.
  function doctype(node) {
    return document.implementation.createDocumentType(
      node.name || 'html',
      node.public || '',
      node.system || '',
    );
  }

  // Create a `text`.
  function text(node) {
    return document.createTextNode(node.value);
  }

  // Create a `comment`.
  function comment(node) {
    return document.createComment(node.value);
  }

  // Create an `element`.
  function element(node, options) {
    const { namespace } = options;
    // TODO: use `g` in SVG space.
    const { tagName = 'div', properties = {}, children = [] } = node;
    const el = typeof namespace !== 'undefined'
      ? document.createElementNS(namespace, tagName)
      : document.createElement(tagName);

    // Add HTML attributes.
    const props = Object.keys(properties);
    const { length } = props;

    for (let i = 0; i < length; i += 1) {
      const key = props[i];

      const {
        attribute,
        property,
        // `mustUseAttribute`,
        mustUseProperty,
        boolean,
        booleanish,
        overloadedBoolean,
        // `number`,
        // `defined`,
        commaSeparated,
        // `spaceSeparated`,
        // `commaOrSpaceSeparated`,
      } = info.find(info.html, key);

      let value = properties[key];

      if (Array.isArray(value)) {
        value = value.join(commaSeparated ? ', ' : ' ');
      }

      if (mustUseProperty) {
        el[property] = value;
      }

      if (boolean || (overloadedBoolean && typeof value === 'boolean')) {
        if (value) {
          el.setAttribute(attribute, '');
        } else {
          el.removeAttribute(attribute);
        }
      } else if (booleanish) {
        el.setAttribute(attribute, value);
      } else if (value === true) {
        el.setAttribute(attribute, '');
      } else if (value || value === 0 || value === '') {
        el.setAttribute(attribute, value);
      }
    }

    return appendAll(el, children, options);
  }

  // the raw node is stored in the value directly
  function raw(node) {
    return node.frag;
  }

  function transform(node, options) {
    switch (node.type) {
      case 'root':
        return root(node, options);
      case 'text':
        return text(node);
      case 'element':
        return element(node, options);
      case 'doctype':
        return doctype(node);
      case 'comment':
        return comment(node);
      case 'raw':
        return raw(node);
      default:
        return element(node, options);
    }
  }

  return transform;
};

export default function toDOM(document, hast, options = {}) {
  return wrap(document)(hast, options);
}
