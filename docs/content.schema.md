
# Content Schema

```
https://ns.adobe.com/helix/pipeline/content
```

The content as retrieved from the repository and enriched in the pipeline.

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Stabilizing | No | Forbidden | Forbidden | [content.schema.json](content.schema.json) |
## Schema Hierarchy

* Content `https://ns.adobe.com/helix/pipeline/content`
  * [MDAST](mdast.schema.md) `https://ns.adobe.com/helix/pipeline/mdast`
  * [Meta](meta.schema.md) `https://ns.adobe.com/helix/pipeline/meta`


# Content Properties

| Property | Type | Required | Nullable | Defined by |
|----------|------|----------|----------|------------|
| [body](#body) | `string` | Optional  | No | Content (this schema) |
| [data](#data) | `object` | Optional  | No | Content (this schema) |
| [document](#document) | `object` | Optional  | No | Content (this schema) |
| [image](#image) | `string` | Optional  | No | Content (this schema) |
| [intro](#intro) | `string` | Optional  | No | Content (this schema) |
| [json](#json) | `object` | Optional  | No | Content (this schema) |
| [mdast](#mdast) | MDAST | Optional  | No | Content (this schema) |
| [meta](#meta) | `object` | Optional  | Yes | Content (this schema) |
| [sources](#sources) | `string[]` | Optional  | No | Content (this schema) |
| [title](#title) | `string` | Optional  | No | Content (this schema) |
| [xml](#xml) | `object` | Optional  | No | Content (this schema) |

## body

The content body of the retrieved source document

`body`

* is optional
* type: `string`
* defined in this schema

### body Type


`string`







## data

Custom object that can hold any user defined data.

`data`

* is optional
* type: `object`
* defined in this schema

### data Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|






## document

The DOM-compatible representation of the document's inner HTML

`document`

* is optional
* type: `object`
* defined in this schema

### document Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|






## image

Path (can be relative) to the first image in the document

`image`

* is optional
* type: `string`
* defined in this schema

### image Type


`string`

* format: `uri-reference` – URI Reference (according to [RFC3986](https://tools.ietf.org/html/rfc3986))






## intro

Extracted first paragraph of the document

`intro`

* is optional
* type: `string`
* defined in this schema

### intro Type


`string`







## json

The JSON object to emit.

`json`

* is optional
* type: `object`
* defined in this schema

### json Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|






## mdast


`mdast`

* is optional
* type: MDAST
* defined in this schema

### mdast Type


* [MDAST](mdast.schema.md) – `https://ns.adobe.com/helix/pipeline/mdast`





## meta


`meta`

* is optional
* type: `object`
* defined in this schema

### meta Type


`object`, nullable, with following properties:


| Property | Type | Required |
|----------|------|----------|
| `class`| string | Optional |
| `image`| string | Optional |
| `intro`| string | Optional |
| `meta`| boolean | Optional |
| `tagname`| string | Optional |
| `title`| string | Optional |
| `types`| boolean | Optional |



#### class

The CSS class to use for the section instead of the default `hlx-section` one

`class`

* is optional
* type: `string`

##### class Type


`string`









#### image

Path (can be relative) to the first image in the document

`image`

* is optional
* type: `string`

##### image Type


`string`

* format: `uri-reference` – URI Reference (according to [RFC3986](https://tools.ietf.org/html/rfc3986))








#### intro

Extracted first paragraph of the document

`intro`

* is optional
* type: `string`

##### intro Type


`string`









#### meta

When set to `true`, will output the additional meta properties as data attributes (i.e. `'foo = bar'` will become `data-hlx-foo='bar'`)

`meta`

* is optional
* type: `boolean`

##### meta Type


`boolean`







#### tagname

The element tag name to use for the section instead of the default `div` one (i.e. `section`, `main`, `aside`)

`tagname`

* is optional
* type: `string`

##### tagname Type


`string`









#### title

Extracted title of the document

`title`

* is optional
* type: `string`

##### title Type


`string`









#### types

When set to `true`, will output the section types as additional CSS classes (i.e. `class='hlx-section has-image has-heading'`)

`types`

* is optional
* type: `boolean`

##### types Type


`boolean`










## sources

List of URIs that have been retrieved for this piece of content

`sources`

* is optional
* type: `string[]`
* defined in this schema

### sources Type


Array type: `string[]`

All items must be of the type:
`string`

* format: `uri` – Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))








## title

Extracted title of the document

`title`

* is optional
* type: `string`
* defined in this schema

### title Type


`string`







## xml

The XML object to emit. See xmlbuilder-js for syntax.

`xml`

* is optional
* type: `object`
* defined in this schema

### xml Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|





