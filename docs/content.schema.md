
# Content Schema

```
https://ns.adobe.com/helix/pipeline/content
```

The content as retrieved from the repository and enriched in the pipeline.

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Forbidden | [content.schema.json](content.schema.json) |
## Schema Hierarchy

* Content `https://ns.adobe.com/helix/pipeline/content`
  * [mdast.schema](mdast.schema.md) `https://ns.adobe.com/helix/pipeline/mdast`
  * [Meta](meta.schema.md) `https://ns.adobe.com/helix/pipeline/meta`


# Content Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [body](#body) | `string` | Optional | Content (this schema) |
| [children](#children) | `string[]` | Optional | Content (this schema) |
| [document](#document) | `object` | Optional | Content (this schema) |
| [htast](#htast) | `object` | Optional | Content (this schema) |
| [html](#html) | `string` | Optional | Content (this schema) |
| [image](#image) | `string` | Optional | Content (this schema) |
| [intro](#intro) | `string` | Optional | Content (this schema) |
| [mdast](#mdast) | mdast.schema | Optional | Content (this schema) |
| [meta](#meta) | `object` | Optional | Content (this schema) |
| [sections](#sections) | section.schema | Optional | Content (this schema) |
| [sources](#sources) | `string[]` | Optional | Content (this schema) |
| [title](#title) | `string` | Optional | Content (this schema) |

## body

The content body of the retrieved source document

`body`
* is optional
* type: `string`
* defined in this schema

### body Type


`string`






## children

Deprecated: the main HTML elements of the document. `document.children[].innerHTML` instead.

`children`
* is optional
* type: `string[]`

* defined in this schema

### children Type


Array type: `string[]`

All items must be of the type:
`string`









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






## htast

Deprecated: the Hypermedia (HAST) AST

`htast`
* is optional
* type: `object`
* defined in this schema

### htast Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|






## html

Deprecated: the main HTML of the document. Use `document.innerHTML` instead.

`html`
* is optional
* type: `string`
* defined in this schema

### html Type


`string`






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






## mdast


`mdast`
* is optional
* type: mdast.schema
* defined in this schema

### mdast Type


* [mdast.schema](mdast.schema.md) – `https://ns.adobe.com/helix/pipeline/mdast`





## meta

Extracted metadata fron the frontmatter of the document

`meta`
* is optional
* type: `object`
* defined in this schema

### meta Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|






## sections

The extracted sections of the document

`sections`
* is optional
* type: section.schema

* defined in this schema

### sections Type


Array type: section.schema

All items must be of the type:
* [section.schema](section.schema.md) – `https://ns.adobe.com/helix/pipeline/section`








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





