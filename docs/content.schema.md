
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
| [document](#document) | `object` | Optional  | No | Content (this schema) |
| [image](#image) | `string` | Optional  | No | Content (this schema) |
| [intro](#intro) | `string` | Optional  | No | Content (this schema) |
| [json](#json) | `object` | Optional  | No | Content (this schema) |
| [mdast](#mdast) | MDAST | Optional  | No | Content (this schema) |
| [meta](#meta) | `object` | Optional  | No | Content (this schema) |
| [sections](#sections) | Section | Optional  | No | Content (this schema) |
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

Extracted metadata from the frontmatter of the document

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
* type: Section
* defined in this schema

### sections Type


Array type: Section

All items must be of the type:
* [Section](section.schema.md) – `https://ns.adobe.com/helix/pipeline/section`








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





