
# Meta Schema

```
https://ns.adobe.com/helix/pipeline/meta
```

Content and Section Metadata Properties

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Cannot be instantiated | Yes | Stabilizing | No | Forbidden | Permitted | [meta.schema.json](meta.schema.json) |

# Meta Definitions

| Property | Type | Group |
|----------|------|-------|
| [class](#class) | `string` | `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta` |
| [image](#image) | `string` | `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta` |
| [intro](#intro) | `string` | `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta` |
| [meta](#meta) | `boolean` | `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta` |
| [tagname](#tagname) | `string` | `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta` |
| [title](#title) | `string` | `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta` |
| [types](#types) | `boolean` | `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta` |

## class

The CSS class to use for the section instead of the default `hlx-section` one

`class`

* is optional
* type: `string`
* defined in this schema

### class Type


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







## meta

When set to `true`, will output the additional meta properties as data attributes (i.e. `'foo = bar'` will become `data-hlx-foo='bar'`)

`meta`

* is optional
* type: `boolean`
* defined in this schema

### meta Type


`boolean`





## tagname

The element tag name to use for the section instead of the default `div` one (i.e. `section`, `main`, `aside`)

`tagname`

* is optional
* type: `string`
* defined in this schema

### tagname Type


`string`







## title

Extracted title of the document

`title`

* is optional
* type: `string`
* defined in this schema

### title Type


`string`







## types

When set to `true`, will output the section types as additional CSS classes (i.e. `class='hlx-section has-image has-heading'`)

`types`

* is optional
* type: `boolean`
* defined in this schema

### types Type


`boolean`




