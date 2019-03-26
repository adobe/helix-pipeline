
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
| [image](#image) | `string` | `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta` |
| [intro](#intro) | `string` | `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta` |
| [meta](#meta) | `object` | `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta` |
| [title](#title) | `string` | `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta` |

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

Extracted metadata from the frontmatter of the document

`meta`

* is optional
* type: `object`
* defined in this schema

### meta Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|






## title

Extracted title of the document

`title`

* is optional
* type: `string`
* defined in this schema

### title Type


`string`






