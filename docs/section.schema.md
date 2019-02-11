
# Section Schema

```
https://ns.adobe.com/helix/pipeline/section
```

A section in a markdown document

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | Yes | Experimental | No | Forbidden | Permitted | [section.schema.json](section.schema.json) |
## Schema Hierarchy

* Section `https://ns.adobe.com/helix/pipeline/section`
  * [Position](position.schema.md) `https://ns.adobe.com/helix/pipeline/position`
  * [Meta](meta.schema.md) `https://ns.adobe.com/helix/pipeline/meta`


# Section Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [children](#children) | MDAST | Optional | Section (this schema) |
| [image](#image) | `string` | Optional | [Meta](meta.schema.md#image) |
| [intro](#intro) | `string` | Optional | [Meta](meta.schema.md#intro) |
| [meta](#meta) | `object` | Optional | [Meta](meta.schema.md#meta) |
| [position](#position) | Position | Optional | Section (this schema) |
| [title](#title) | `string` | Optional | [Meta](meta.schema.md#title) |
| [type](#type) | `const` | Optional | Section (this schema) |
| [types](#types) | `string[]` | Optional | Section (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## children

The AST nodes making up the section. Section dividers are not included.

`children`

* is optional
* type: MDAST
* defined in this schema

### children Type


Array type: MDAST

All items must be of the type:
* [MDAST](mdast.schema.md) – `https://ns.adobe.com/helix/pipeline/mdast`








## image

Path (can be relative) to the first image in the document

`image`

* is optional
* type: `string`
* defined in [Meta](meta.schema.md#image)

### image Type


`string`

* format: `uri-reference` – URI Reference (according to [RFC3986](https://tools.ietf.org/html/rfc3986))






## intro

Extracted first paragraph of the document

`intro`

* is optional
* type: `string`
* defined in [Meta](meta.schema.md#intro)

### intro Type


`string`







## meta

Extracted metadata fron the frontmatter of the document

`meta`

* is optional
* type: `object`
* defined in [Meta](meta.schema.md#meta)

### meta Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|






## position


`position`

* is optional
* type: Position
* defined in this schema

### position Type


* [Position](position.schema.md) – `https://ns.adobe.com/helix/pipeline/position`





## title

Extracted title of the document

`title`

* is optional
* type: `string`
* defined in [Meta](meta.schema.md#title)

### title Type


`string`







## type

The MDAST node type. Each section can be treated as a standalone document.

`type`

* is optional
* type: `const`
* defined in this schema

The value of this property **must** be equal to:

```json
"root"
```





## types

The inferred class names for the section

`types`

* is optional
* type: `string[]`
* defined in this schema

### types Type


Array type: `string[]`

All items must be of the type:
`string`









