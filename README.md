# Helix Pipeline

(formerly known as Hypermedia Pipeline)

This project provides helper functions and default implementations for creating Hypermedia Processing Pipelines.

It uses reducers and continuations to create a simple processing pipeline that can pre-and post-process HTML, JSON, and other hypermedia.

# Status

[![codecov](https://img.shields.io/codecov/c/github/adobe/helix-pipeline.svg)](https://codecov.io/gh/adobe/helix-pipeline)
[![CircleCI](https://img.shields.io/circleci/project/github/adobe/helix-pipeline.svg)](https://circleci.com/gh/adobe/helix-pipeline)
[![GitHub license](https://img.shields.io/github/license/adobe/helix-pipeline.svg)](https://github.com/adobe/helix-pipeline/blob/master/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/adobe/helix-pipeline.svg)](https://github.com/adobe/helix-pipeline/issues)
[![npm](https://img.shields.io/npm/dw/@adobe/helix-pipeline.svg)](https://www.npmjs.com/package/@adobe/helix-pipeline) [![Greenkeeper badge](https://badges.greenkeeper.io/adobe/helix-pipeline.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/adobe/hypermedia-pipeline/badge.svg?targetFile=package.json)](https://snyk.io/test/github/adobe/hypermedia-pipeline?targetFile=package.json)

## Anatomy of a Pipeline

A pipeline consists of following main parts:

- pre-processing functions
- the main response generating function
- an optional wrapper function
- post-processing functions
- error handling functions

Each step of the pipeline is processing a single payload object, that will slowly accumulate the `return` values of the functions above through `Object.assign`.

See below for the anatomy of a payload.

Typically, there is one pipeline for each content type supported and pipeline are identified by file name, e.g.

- `html.pipe.js` – creates HTML documents with the `text/html` content-type
- `json.pipe.js` – creates JSON documents with the `application/json` content-type

### Building a Pipeline

A pipeline builder can be created by creating a CommonJS module that exports a function `pipe` which accepts following arguments and returns a Pipeline function.

- `cont`: the main function that will be executed as a continuation of the pipeline
- `payload`: the [payload](./docs/context.schema.md) (aka context) that is accumulated during the pipeline. 
- `action`: the [action](./docs/action.schema.md) that servers as holder for extra pipeline invocation argument.

This project's main entry provides a helper function for pipeline construction and a few helper functions, so that a basic pipeline can be constructed like this:

```javascript
// the pipeline itself
const pipeline = require("@adobe/hypermedia-pipeline");

module.exports.pipe = function(cont, context, action) {
    action.logger.log("debug", "Constructing Custom Pipeline");

    return pipeline()
        .before(adjustContent)
        .once(cont)            // required: execute the continuation function
        .after(cleanupContent)
}
```

In a typical pipeline, you will add additional processing steps as `.before(require('some-module'))` or as `.after(require('some-module'))`.

### The Main Function

The main function is typically a pure function that converts the `request` and `content` properties of the `context` into a `response` object.

In most scenarios, the main function is compiled from a template in a templating language like HTL, JST, or JSX.

Typically, there is one template (and thus one main function) for each content variation of the file type. Content variations are identified by a selector (the piece of the file name before the file extension, e.g. in `example.navigation.html` the selector would be `navigation`). If no selector is provided, the template is the default template for the pipeline.

Examples of possible template names include:

- `html.jsx` (compiled to `html.js`) – default for the HTML pipeline
- `html.navigation.jst` (compiled to `html.navigation.js`) – renders the navigation
- `dropdown.json.js` (not compiled) – creates pure JSON output
- `dropdown.html.htl` (compiled to `dropdown.html.js`) – renders the dropdown component


### (Optional) The Wrapper Function

Sometimes it is necessary to pre-process the payload in a template-specific fashion. This wrapper function (often called "Pre-JS" for brevity sake) allows the full transformation of the pipeline's payload.

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
// - `action` (the action of the pipeline)
module.exports.pre = (cont, payload, action) => {
    const {request, content, response} = payload;
    
    // modifying the payload content before invoking the main function
    content.hello = 'World';
    const modifiedpayload = {request, content, response};

    // invoking the main function with the new payload. Capturing the response
    // payload for further modification

    const responsepayload = cont(modifiedpayload, action);

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

### Error Handlers

In default state, the pipeline will process all normal functions but will skip `error handlers`  (`.error()`). When the pipeline is in the _error state_ normal processing functions are suspended until the end of the pipeline is reached, or the _error state_ is cleared. While in the _error state_, _error handlers_ will be executed.
The pipeline execution is in an _error state_ if `context.error` is defined. An _Error state_ can happen when a processing function throws an Exception, or if it sets the `context.error` object directly.

Example:

```js
new pipeline()
  .before(doSomething)
  .once(render)
  .after(cleanup)
  .error(handleError)
  .after(done);
```

If in the above example, the `doSomething` causes an error, subsequently, `render` and `cleanup` will not be invoked. but `handleError` will. If `handleError` clears the error state (i.e. sets `context.error = null`), the `done` function will be invoked again.

If in the above example, none of the functions causes an error, the `handleError` will never be invoked.

## Anatomy of the Payload

Following main properties exist:

- `request`
- `content`
- `response`
- `error`

also see [context schema](./docs/context.schema.md)

### The `request` object

- `params`: a map of request parameters
- `headers`: a map of HTTP headers

also see [request schema](./docs/request.schema.md)

### The `content` object

- `body`: the unparsed content body as a `string`
- `mdast`: the parsed [Markdown AST](https://github.com/syntax-tree/mdast)
- `meta`: a map metadata properties, including
  - `title`: title of the document
  - `intro`: a plain-text introduction or description
  - `type`: the content type of the document
  - `image`: the URL of the first image in the document
- `htast`: the HTML AST
- `document`: a DOM-compatible [`Document`](https://developer.mozilla.org/en-US/docs/Web/API/Document) representation of the (HTML) document ([see below](#contentdocument-in-detail))
- `sections[]`: The main sections of the document, as an enhanced MDAST ([see below](#contentsections-in-detail))
- `html`: a string of the content rendered as HTML
- `children`: an array of top-level elements of the HTML-rendered content

also see [content schema](./docs/content.schema.md)

### `content.document` in Detail

For developers that prefer using the rendered HTML over the input Markdown AST, `content.document` provides a representation of the rendered HTML that is API-compatible to the `window.document` object you would find in a browser.

The most common way of using it is probably calling `content.document.innerHTML`, which gives the full HTML of the page, but other functions like

- `content.document.getElementsByClassName`
- `content.document.querySelector`
- `content.document.querySelectorAll`

are also available. Please note that some functions like

- `content.document.getElementsByClassName`
- `content.document.getElementByID`

are less useful because the HTML generated by the default pipeline does not inject class name or ID attributes.

The tooling for generating (Virtual) DOM nodes from Markdown AST is made available as a utility class, so that it can be used in custom `pre.js` scripts, and [described below](#generate-a-virtual-dom-with-utilsvdom).

### `content.sections` in Detail

The default pipeline extracts sections from a Markdown document, using both "thematic breaks" like `***` or `---` and embedded YAML blocks as section markers. If no sections can be found in the document, the entire `content.mdast` will be identically to `content.sections[0]`.

`content.sections` is an Array of `section` nodes, with `type` (String) and `children` (array of Node) properties. In addition, each section has a `types` attribute, which is an array of derived content types. Project Helix (and Hypermedia Pipeline) uses implied typing over declared content typing, which means it is not the task of the author to explicitly declare the content type of a section or document, but rather have the template interpret the contents of a section to understand the type of content it is dealing with.

The `types` property is an array of string values that describes the type of the section based on the occurrence of child nodes. This makes it easy to copy the value of `types` into the `class` attribute of an HTML element, so that CSS expressions matching types of sections can be written with ease. Following patterns of `type` values can be found:

- `has-<type>`: for each type of content that occurs at least once in the section, e.g. has-heading
- `has-only-<type>`: for sections that only have content of a single type, e.g. has-only-image
- `is-<type-1>-<type-2>-<type3>`, `is-<type-1>-<type-2>`, and `is-<type-1>` for the top 3 most frequent types of children in the section. For instance a gallery with a heading and description would be `is-image-text-heading`. You can infer additional types using [`utils.types`](#infer-content-types-with-utilstypes).
- `nb-<type>-<occurences>`: number of occurences of each type in the section

Each section has additional content-derived metadata properties, in particular:

- `title`: the value of the first headline in the section
- `intro`: the value of the first paragraph in the section
- `image`: the URL of the first image in the section
- `meta`: the parsed YAML metadata of the section (as an object)



### The `response` object

- `body`: the unparsed response body as a `string`
- `headers`: a map of HTTP response headers
- `status`: the HTTP status code

also see [response schema](./docs/response.schema.md)

### The `error` object

This object is only set when there has been an error during pipeline processing. Any step in the pipeline may set the `error` object. Subsequent steps should simply skip any processing if they encounter an `error` object.

Alternatively, steps can attempt to handle the `error` object, for instance by generating a formatted error message and leaving it in `response.body`.

The only known property in `error` is

- `message`: the error message

## Utilities

### Generate a Virtual DOM with `utils.vdom`

`VDOM` is a helper class that transforms [MDAST](https://github.com/syntax-tree/mdast) Markdown into DOM nodes using customizable matcher functions or expressions. 

It can be used in scenarios where:

- you need to represent only a `section` of the document in HTML
- you have made changes to `content.mdast` and want them reflected in HTML
- you want to customize the HTML output for certain Markdown elements

#### Getting Started

Load the `VDOM` helper through:

```javascript
const VDOM = require('@adobe/helix-pipeline').utils.vdom;
```

#### Simple Transformations

```javascript
content.document = new VDOM(content.mdast).getDocument();
```

This replaces `content.document` with a re-rendered representation of the Markdown AST. It can be used when changes to `content.mdast` have been made.

```javascript
content.document = new VDOM(content.sections[0]).getDocument();
```

This uses only the content of the first section to render the document.

#### Matching Nodes

Nodes in the Markdown AST can be matched in two ways: either using a [select](https://www.npmjs.com/package/unist-util-select)-statement or using a predicate function.

```javascript
const vdom = new VDOM(content.mdast);
vdom.match('heading', () => '<h1>This text replaces your heading</h1>');
content.document = vdom.getDocument();
```

Every node with the type `heading` will be rendered as `<h1>This text replaces your heading</h1>`;

```javascript
const vdom = new VDOM(content.mdast);
vdom.match(function test(node) {
  return node.type === 'heading';
}, () => '<h1>This text replaces your heading</h1>');
content.document = vdom.getDocument();
```

Instead of the select-statement, you can also provide a function that returns `true` or `false`. The two examples above will have the same behavior.

#### Creating DOM Nodes

The second argument to `match` is a node-generating function that should return one of the following three options:

1. an [HAST](https://github.com/syntax-tree/hast) (Hypertext Abstract Syntax Tree) node
2. a DOM [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
3. a `String` containing HTML tags.

```javascript
vdom.match('link', (_, node) => {
  return {
    type: 'element',
    tagName: 'a',
    properties: {
      href: node.url,
      rel: 'nofollow'
    },
    children: [
      {
        type: 'text',
        value: node.children.map(({ value }) => value)
      }
    ]
  }
}
```

Above: injecting `rel="nofollow"` using HTAST.

```javascript
const h = require('hyperscript');

vdom.match('link', (_, node) => h(
    'a',
    { href: node.url, rel: 'nofollow' },
    node.children.map(({ value }) => value),
  );
```

Above: doing the same using [Hyperscript](https://github.com/hyperhype/hyperscript) (which creates DOM elements) is notably shorter.

```javascript
vdom.match('link', (_, node) => 
  `<a href="${node.url}" rel="nofollow">$(node.children.map(({ value }) => value)).join('')</a>`;
```

Above: Plain `String`s can be constructed using String Templates in ES6 for the same result.

#### Creating Responsive Images

The VDOM Utility is prepared to create `srcset` and `sizes` attributes for responsive images. By default, five different resolutions ranging from `480w` to `4096w` will be generated. To create truly effective responsive images, some knowledge of the desired layout of the page, and hence some configuration is required.

`utils.vdom` provides two configuration options:

1. Define what physical image widths are made available with `widths`
2. Define which images get loaded with `sizes`

Both configuration options get passed to an optional `options` argument for the `VDOM` constructor:


```javascript
const widths;
const sizes;
content.document = new VDOM(content.mdast, {widths, sizes}).getDocument();
```

`widths` is either an array of possible image widths (positive integer values) or a `widthpec` that looks like this:

```javascript
const widths = {
  from: 320,
  to: 9600,
  steps: 10
};
const sizes;
content.document = new VDOM(content.mdast, {widths, sizes}).getDocument();
```

Responsive images will be generated on the fly and only when requested, so the only cost involved with increasing the number of `steps` is the length of the resultant `srcset` attribute.

In order to define what images get loaded, the `sizes` attribute must be set. In HTML, sizes is a comma-separated list of pairs of media queries and length expressions. For `util.vdom`, the setting is an array of these pairs.

```javascript
const widths;
const sizes = [
  '(min-width: 36em) 33.3vw',
  '(min-width: 48em) calc(.333 * (100vw - 12em))',
  '100vw'
];
content.document = new VDOM(content.mdast, {widths, sizes}).getDocument();
```

This gives you fine-grained control over the image widths that are made available and will get loaded by browsers based on the width of the browser window. With `util.vdom` you can have different settings per page- or section-type.

### Infer Content Types with `utils.types`

In addition to the automatically inferred content types for each section, `utils.types` provides a `TypeMatcher` utility class that allows matching section content against a simple expression language and thus enrich the `section[].types` values.


```javascript
const TypeMatcher = require('@adobe/hypermedia-pipeline').utils.types;

const matcher = new TypeMatcher(content.sections);
matcher.match('^heading', 'starts-with-heading');
content.sections = matcher.process();
```

In the example above, all sections that have a `heading` as the first child will get the value `starts-with-heading` appended to the `types` array. `^heading` is an example of the content expression language, which allows matching content against a simple regular expression-like syntax.

##### Content Expression Language

* `^heading` – the first element is a `heading`
* `paragraph$` – the last element is a `paragraph`
* `heading image+` – a `heading` followed by one or more `image`s
* `heading? image` – an optional `heading` followed by one `image`
* `heading paragraph* image` – a `heading` followed by any number of `paragraph`s (also no paragraphs at all), followed by an `image`
* `(paragraph|list)` – a `paragraph` or a `list`
* `^heading (image paragraph)+$` – one `heading`, followed by pairs of `image` and `paragraph`, but at least one

### Inspecting the Pipeline Context

When run in non-production, i.e. outside an OpenWhisk action, for example in `hlx up`, Pipeline Dumping is enabled. Pipeline Dumping allows developers to easily inspect the `Context` object of each step of the pipeline and can be used to debug pipeline functions and to generate realistic test cases.

Each stage of the pipeline processing will create a file like `$PWD/logs/debug/context_dump_34161BE5KuR0nuFDp/context-20180902-1418-05.0635-step-2.json` inside the `debug` directory. These dumps will be removed when the `node` process ends, so that after stopping `hlx up` the `debug` directory will be clean again. The `-step-n` in the filename indicates the step in the pipeline that has been logged.

A simple example might look like this:

Step 0:
```json
{}
```

Step 1:
```json
{
  "request": {}
}
```

Step 2:
```json
{
  "request": {},
  "content": {
    "body": "---\ntemplate: Medium\n---\n\n# Bill, Welcome to the future\n> Project Helix\n\n## Let's talk about Project Helix\n![](./moscow/assets/IMG_0167.jpg)\n",
    "sources": [
      "https://raw.githubusercontent.com/trieloff/soupdemo/master/hello.md"
    ]
  }
}
```

Step 3 (diff only):
```diff
@@ -1,6 +1,58 @@
 {
   "content": {
-    "body": "Hello World"
+    "body": "Hello World",
+    "mdast": {
+      "type": "root",
+      "children": [
+        {
+          "type": "paragraph",
+          "children": [
+            {
+              "type": "text",
+              "value": "Hello World",
+              "position": {
+                "start": {
+                  "line": 1,
+                  "column": 1,
+                  "offset": 0
+                },
+                "end": {
+                  "line": 1,
+                  "column": 12,
+                  "offset": 11
+                },
+                "indent": []
+              }
+            }
+          ],
+          "position": {
+            "start": {
+              "line": 1,
+              "column": 1,
+              "offset": 0
+            },
+            "end": {
+              "line": 1,
+              "column": 12,
+              "offset": 11
+            },
+            "indent": []
+          }
+        }
+      ],
+      "position": {
+        "start": {
+          "line": 1,
+          "column": 1,
+          "offset": 0
+        },
+        "end": {
+          "line": 1,
+          "column": 12,
+          "offset": 11
+        }
+      }
+    }
   },
   "request": {}
 }
```

Step 5 (diff only):
```diff
@@ -52,7 +52,49 @@
           "offset": 11
         }
       }
-    }
+    },
+    "sections": [
+      {
+        "type": "root",
+        "children": [
+          {
+            "type": "paragraph",
+            "children": [
+              {
+                "type": "text",
+                "value": "Hello World",
+                "position": {
+                  "start": {
+                    "line": 1,
+                    "column": 1,
+                    "offset": 0
+                  },
+                  "end": {
+                    "line": 1,
+                    "column": 12,
+                    "offset": 11
+                  },
+                  "indent": []
+                }
+              }
+            ],
+            "position": {
+              "start": {
+                "line": 1,
+                "column": 1,
+                "offset": 0
+              },
+              "end": {
+                "line": 1,
+                "column": 12,
+                "offset": 11
+              },
+              "indent": []
+            }
+          }
+        ]
+      }
+    ]
   },
   "request": {}
 }
 ```

 Step 6 (diff only):
 ```diff
@@ -92,9 +92,19 @@
               "indent": []
             }
           }
-        ]
+        ],
+        "title": "Hello World",
+        "types": [
+          "has-text",
+          "has-only-text"
+        ],
+        "intro": "Hello World",
+        "meta": {}
       }
-    ]
+    ],
+    "meta": {},
+    "title": "Hello World",
+    "intro": "Hello World"
   },
   "request": {}
 }
 ```

 Step 9 (diff only):

 ```diff
 @@ -169,7 +169,11 @@
         "search": "",
         "hash": ""
       }
-    }
+    },
+    "html": "<p>Hello World</p>",
+    "children": [
+      "<p>Hello World</p>"
+    ]
   },
   "request": {}
 }
 ```

 Step 10 (diff only):

 ```diff
 @@ -175,5 +175,9 @@
       "<p>Hello World</p>"
     ]
   },
-  "request": {}
+  "request": {},
+  "response": {
+    "status": 201,
+    "body": "<p>Hello World</p>"
+  }
 }
 ```
