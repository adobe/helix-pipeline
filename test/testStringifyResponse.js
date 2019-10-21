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
/* eslint-env mocha */
const assert = require("assert");
const { JSDOM } = require("jsdom");
const { Logger } = require("@adobe/helix-shared");
const stringify = require("../src/html/stringify-response");

const logger = Logger.getTestLogger({
  // tune this for debugging
  level: "info"
});

describe("Testing stringify pipeline step", () => {
  it("document can be transformed", () => {
    const dom = new JSDOM(
      "<html><head><title>Foo</title></head><body>bar</body></html>"
    );
    dom.window.document.serialize = dom.serialize.bind(dom);
    const context = {
      response: {
        document: dom.window.document
      }
    };
    stringify(context, { logger });
    assert.equal(
      context.response.body,
      "<html><head><title>Foo</title></head><body>bar</body></html>"
    );
  });

  it("document without serialize function can be transformed", () => {
    const dom = new JSDOM(
      "<html><head><title>Foo</title></head><body>bar</body></html>"
    );
    const context = {
      response: {
        document: dom.window.document
      }
    };
    stringify(context, { logger });
    assert.equal(
      context.response.body,
      "<html><head><title>Foo</title></head><body>bar</body></html>"
    );
  });

  it("document with doctype can be transformed", () => {
    const dom = new JSDOM(
      "<!DOCTYPE html><html><head><title>Foo</title></head><body>bar</body></html>"
    );
    const context = {
      response: {
        document: dom.window.document
      }
    };
    stringify(context, { logger });
    assert.equal(
      context.response.body,
      "<!DOCTYPE html><html><head><title>Foo</title></head><body>bar</body></html>"
    );
  });

  it("document body can be transformed", () => {
    const dom = new JSDOM(
      "<html><head><title>Foo</title></head><body>bar</body></html>"
    );
    const context = {
      response: {
        document: dom.window.document.body
      }
    };
    stringify(context, { logger });
    assert.equal(context.response.body, "bar");
  });

  it("response body takes precedence over document can be transformed", () => {
    const dom = new JSDOM(
      "<html><head><title>Foo</title></head><body>bar</body></html>"
    );
    dom.window.document.serialize = dom.serialize.bind(dom);
    const context = {
      response: {
        body: "foobar",
        document: dom.window.document
      }
    };
    stringify(context, { logger });
    assert.equal(context.response.body, "foobar");
  });

  it("throws error if neither body or document is present in the response", () => {
    const context = {
      response: {}
    };
    try {
      stringify(context, { logger });
      assert.fail();
    } catch (e) {
      assert.equal("no response", e.message);
    }
  });

  it("throws error if document is not serializable", () => {
    const context = {
      response: {
        document: {}
      }
    };
    try {
      stringify(context, { logger });
      assert.fail();
    } catch (e) {
      assert.equal(
        "unexpected context.response.document: [object Object]",
        e.message
      );
    }
  });
});
