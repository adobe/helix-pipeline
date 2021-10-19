# Untitled undefined type in Section Schema

```txt
https://ns.adobe.com/helix/pipeline/section#/definitions/section
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                         |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [section.schema.json*](section.schema.json "open original schema") |

## section Type

unknown

# section Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                           |
| :-------------------- | :------------ | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)         | Not specified | Optional | cannot be null | [Section](section-definitions-section-properties-type.md "https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/type")         |
| [position](#position) | `object`      | Optional | cannot be null | [Section](mdast-properties-position.md "https://ns.adobe.com/helix/pipeline/position#/definitions/section/properties/position")                      |
| [children](#children) | `array`       | Optional | cannot be null | [Section](section-definitions-section-properties-children.md "https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/children") |
| [meta](#meta)         | `object`      | Optional | can be null    | [Section](meta-definitions-meta.md "https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/meta")                               |
| [title](#title)       | `string`      | Optional | cannot be null | [Section](meta-definitions-meta-properties-title.md "https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/title")             |
| [intro](#intro)       | `string`      | Optional | cannot be null | [Section](meta-definitions-meta-properties-intro.md "https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/intro")             |
| [image](#image)       | `string`      | Optional | cannot be null | [Section](meta-definitions-meta-properties-image.md "https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/image")             |

## type

The MDAST node type. Each section can be treated as a standalone document.

`type`

*   is optional

*   Type: unknown

*   cannot be null

*   defined in: [Section](section-definitions-section-properties-type.md "https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"root"
```

## position

Marks the position of an AST node in the original text flow

`position`

*   is optional

*   Type: `object` ([Position](mdast-properties-position.md))

*   cannot be null

*   defined in: [Section](mdast-properties-position.md "https://ns.adobe.com/helix/pipeline/position#/definitions/section/properties/position")

### position Type

`object` ([Position](mdast-properties-position.md))

## children

The AST nodes making up the section. Section dividers are not included.

`children`

*   is optional

*   Type: `object[]` ([MDAST](content-properties-mdast.md))

*   cannot be null

*   defined in: [Section](section-definitions-section-properties-children.md "https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/children")

### children Type

`object[]` ([MDAST](content-properties-mdast.md))

## meta



`meta`

*   is optional

*   Type: `object` ([Details](meta-definitions-meta.md))

*   can be null

*   defined in: [Section](meta-definitions-meta.md "https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/meta")

### meta Type

`object` ([Details](meta-definitions-meta.md))

## title

Extracted title of the document

`title`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Section](meta-definitions-meta-properties-title.md "https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/title")

### title Type

`string`

## intro

Extracted first paragraph of the document

`intro`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Section](meta-definitions-meta-properties-intro.md "https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/intro")

### intro Type

`string`

## image

Path (can be relative) to the first image in the document

`image`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Section](meta-definitions-meta-properties-image.md "https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/image")

### image Type

`string`

### image Constraints

**URI reference**: the string must be a URI reference, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")
