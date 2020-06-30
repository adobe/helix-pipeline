---
title: foo
---

# Hypermedia Pipeline

This project provides helper functions and default implementations for creating Hypermedia Processing Pipelines.

It uses reducers and continuations to create a simple processing pipeline that can pre-and post-process HTML, JSON, and other hypermedia.

# Status

[![codecov](https://img.shields.io/codecov/c/github/adobe/hypermedia-pipeline.svg)](https://codecov.io/gh/adobe/hypermedia-pipeline)
[![CircleCI](https://img.shields.io/circleci/project/github/adobe/hypermedia-pipeline.svg)](https://circleci.com/gh/adobe/parcel-plugin-htl)
[![GitHub license](https://img.shields.io/github/license/adobe/hypermedia-pipeline.svg)](https://github.com/adobe/hypermedia-pipeline/blob/master/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/adobe/hypermedia-pipeline.svg)](https://github.com/adobe/hypermedia-pipeline/issues)
[![npm](https://img.shields.io/npm/dw/@adobe/hypermedia-pipeline.svg)](https://www.npmjs.com/package/@adobe/hypermedia-pipeline) [![Greenkeeper badge](https://badges.greenkeeper.io/adobe/hypermedia-pipeline.svg)](https://greenkeeper.io/)

---
class: section
---

## Anatomy of a Pipeline

A pipeline consists of following main parts:

- pre-processing functions
- the main response generating function
- an optional wrapper function
- post-processing functions

Each step of the pipeline is processing a single payload object, that will slowly accumulate the `return` values of the functions above through `Object.assign`.

***
This section has a paragraph, but no title.

Tough luck.
***

## This section has a title, but no paragraph

***

See below for the anatomy of a payload.

Typically, there is one pipeline for each content type supported and pipeline are identified by file name, e.g.

- `html.pipe.js` – creates HTML documents with the `text/html` content-type
- `json.pipe.js` – creates JSON documents with the `application/json` content-type


---
class: code
---


### Building a Pipeline

A pipeline builder can be created by creating a CommonJS module that exports a function `pipe` which accepts following arguments and returns a Pipeline function.

- `cont`: the main function that will be executed as a continuation of the pipeline
- `params`: a map of parameters that are interpreted at runtime
- `secrets`: a map of protected configuration parameters like API keys that should be handled with care. By convention, all keys in `secret` are in ALL_CAPS_SNAKE_CASE.
- `logger`: a [Winston](https://www.github.com/winstonjs/winston) logger

This project's main entry provides a helper function for pipeline construction and a few helper functions, so that a basic pipeline can be constructed like this:

```javascript
// the pipeline itself
const pipeline = require("@adobe/hypermedia-pipeline");
// helper functions and log
const { adaptOWRequest, adaptOWResponse, log } = require('@adobe/hypermedia-pipeline/src/defaults/default.js');

module.exports.pipe = function(cont, params, secrets, logger = log) {
    logger.debug("Constructing Custom Pipeline");

    return pipeline()
        .pre(adaptOWRequest)   // optional: turns OpenWhisk-style arguments into a proper payload
        .once(cont)            // required: execute the continuation function
        .post(adaptOWResponse) // optional: turns the Payload into an OpenWhisk-style response
}
```

In a typical pipeline, you will add additional processing steps as `.pre(require('some-module'))` or as `.post(require('some-module'))`.

---

### The Main Function

The main function is typically a pure function that converts the `request`, `context`, and `content` properties of the payload into a `response` object.

In most scenarios, the main function is compiled from a template in a templating language like HTL, JST, or JSX.

Typically, there is one template (and thus one main function) for each content variation of the file type. Content variations are identified by a selector (the piece of the file name before the file extension, e.g. in `example.navigation.html` the selector would be `navigation`). If no selector is provided, the template is the default template for the pipeline.

Examples of possible template names include:

- `html.jsx` (compiled to `html.js`) – default for the HTML pipeline
- `html.navigation.jst` (compiled to `html.navigation.js`) – renders the navigation
- `dropdown.json.js` (not compiled) – creates pure JSON output
- `dropdown.html.htl` (compiled to `dropdown.html.js`) – renders the dropdown component


### (Optional) The Wrapper Function

Sometimes it is neccessary to pre-process the payload in a template-specific fashion. This wrapper function (often called "Pre-JS" for brevity sake) allows the full transformation of the pipeline's payload.

Compared to the pipeline-specific pre-processing functions which handle the request, content, and response, the focus of the wrapper function is implementing business logic needed for the main template function. This allows for a clean separation between:

1. presentation (in the main function, often expressed in declarative templates)
2. business logic (in the wrapper function, often expressed in imperative code)
3. content-type specific implementation (in the pipeline, expressed in functional code)

A simple implementation of a wrapper function would look like this:

```javascript
// All wrapper functions must export `pre`
// The functions takes following arguments:
// - `cont` (the continuation function, i.e. the main template function)
// - `payload` (the payload of the pipeline)
module.exports.pre = (cont, payload) => {
    const {request, content, context, response} = payload;
    
    // modifying the payload content before invoking the main function
    content.hello = 'World';
    const modifiedpayload = {request, content, context, response};

    // invoking the main function with the new payload. Capturing the response
    // payload for further modification

    const responsepayload = cont(modifiedpayload);

    // Adding a value to the payload response
    const modifiedresponse = modifiedpayload.response;
    modifiedresponse.hello = 'World';

    return Object.assign(modifiedpayload, modifiedresponse);
}
```

### Pre-Processing Functions

Pre-Processing functions are meant to:

- parse and process request parameters
- fetch and parse the requested content
- transform the requested content

### Post-Processing Functions

Post-Processing functions are meant to:

- process and transform the response

## Anatomy of the Payload

Following main properties exist:

- `request`
- `content`
- `response`
- `context`
- `error`

### The `request` object

- `params`: a map of request parameters
- `headers`: a map of HTTP headers

### The `content` object

- `body`: the unparsed content body as a `string`
- `mdast`: the parsed [Markdown AST](https://github.com/syntax-tree/mdast)
- `meta`: a map metadata properties, including
  - `title`: title of the document
  - `intro`: a plain-text introduction or description
  - `type`: the content type of the document
- `htast`: the HTML AST
- `html`: a string of the content rendered as HTML
- `children`: an array of top-level elements of the HTML-rendered content

### The `response` object

- `body`: the unparsed response body as a `string`
- `headers`: a map of HTTP response headers
- `status`: the HTTP status code

### The `context` object

TBD: used for stuff that is neither content, request, or response

### The `error` object

This object is only set when there has been an error during pipeline processing. Any step in the pipeline may set the `error` object. Subsequent steps should simply skip any processing if they encounter an `error` object.

Alternatively, steps can attempt to handle the `error` object, for instance by generating a formatted error message and leaving it in `response.body`.

The only known property in `error` is

- `message`: the error message
