
# Section Schema

```
https://ns.adobe.com/helix/pipeline/section
```

A section in a markdown document

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Cannot be instantiated | Yes | Experimental | No | Forbidden | Permitted | [section.schema.json](section.schema.json) |

# Section Definitions

| Property | Type | Group |
|----------|------|-------|
| [children](#children) | reference | `https://ns.adobe.com/helix/pipeline/section#/definitions/section` |
| [image](#image) | reference | `https://ns.adobe.com/helix/pipeline/section#/definitions/section` |
| [intro](#intro) | reference | `https://ns.adobe.com/helix/pipeline/section#/definitions/section` |
| [meta](#meta) | reference | `https://ns.adobe.com/helix/pipeline/section#/definitions/section` |
| [position](#position) | reference | `https://ns.adobe.com/helix/pipeline/section#/definitions/section` |
| [title](#title) | reference | `https://ns.adobe.com/helix/pipeline/section#/definitions/section` |
| [type](#type) | `const` | `https://ns.adobe.com/helix/pipeline/section#/definitions/section` |

## children

The AST nodes making up the section. Section dividers are not included.

`children`

* is optional
* type: reference
* defined in this schema

### children Type


Array type: reference

All items must be of the type:
* []() – `https://ns.adobe.com/helix/pipeline/mdast`








## image


`image`

* is optional
* type: reference
* defined in this schema

### image Type


* []() – `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/image`





## intro


`intro`

* is optional
* type: reference
* defined in this schema

### intro Type


* []() – `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/intro`





## meta


`meta`

* is optional
* type: reference
* defined in this schema

### meta Type


* []() – `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta`





## position


`position`

* is optional
* type: reference
* defined in this schema

### position Type


* []() – `https://ns.adobe.com/helix/pipeline/position`





## title


`title`

* is optional
* type: reference
* defined in this schema

### title Type


* []() – `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/title`





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




