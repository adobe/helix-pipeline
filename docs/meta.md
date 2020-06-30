# Meta Schema

```txt
https://ns.adobe.com/helix/pipeline/meta
```

Content and Section Metadata Properties


| Abstract               | Extensible | Status      | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                  |
| :--------------------- | ---------- | ----------- | ----------------------- | :---------------- | --------------------- | ------------------- | ----------------------------------------------------------- |
| Cannot be instantiated | Yes        | Stabilizing | Unknown identifiability | Forbidden         | Allowed               | none                | [meta.schema.json](meta.schema.json "open original schema") |

## Meta Type

unknown ([Meta](meta.md))

# Meta Definitions

## Definitions group meta

Reference this group by using

```json
{"$ref":"https://ns.adobe.com/helix/pipeline/meta#/definitions/meta"}
```

| Property            | Type     | Required | Nullable       | Defined by                                                                                                                               |
| :------------------ | -------- | -------- | -------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| [class](#class)     | `string` | Optional | cannot be null | [Meta](meta-definitions-meta-properties-class.md "https&#x3A;//ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/class")     |
| [tagname](#tagname) | `string` | Optional | cannot be null | [Meta](meta-definitions-meta-properties-tagname.md "https&#x3A;//ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/tagname") |
| [types](#types)     | `array`  | Optional | cannot be null | [Meta](meta-definitions-meta-properties-types.md "https&#x3A;//ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/types")     |
| [title](#title)     | `string` | Optional | cannot be null | [Meta](meta-definitions-meta-properties-title.md "https&#x3A;//ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/title")     |
| [intro](#intro)     | `string` | Optional | cannot be null | [Meta](meta-definitions-meta-properties-intro.md "https&#x3A;//ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/intro")     |
| [image](#image)     | `string` | Optional | cannot be null | [Meta](meta-definitions-meta-properties-image.md "https&#x3A;//ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/image")     |

### class

The CSS class to use for the section instead of the default `hlx-section` one


`class`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Meta](meta-definitions-meta-properties-class.md "https&#x3A;//ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/class")

#### class Type

`string`

### tagname

The element tag name to use for the section instead of the default `div` one (i.e. `section`, `main`, `aside`)


`tagname`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Meta](meta-definitions-meta-properties-tagname.md "https&#x3A;//ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/tagname")

#### tagname Type

`string`

### types

The inferred class names for the section


`types`

-   is optional
-   Type: `string[]`
-   cannot be null
-   defined in: [Meta](meta-definitions-meta-properties-types.md "https&#x3A;//ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/types")

#### types Type

`string[]`

### title

Extracted title of the document


`title`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Meta](meta-definitions-meta-properties-title.md "https&#x3A;//ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/title")

#### title Type

`string`

### intro

Extracted first paragraph of the document


`intro`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Meta](meta-definitions-meta-properties-intro.md "https&#x3A;//ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/intro")

#### intro Type

`string`

### image

Path (can be relative) to the first image in the document


`image`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Meta](meta-definitions-meta-properties-image.md "https&#x3A;//ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/image")

#### image Type

`string`

#### image Constraints

**URI reference**: the string must be a URI reference, according to [RFC 3986](https://tools.ietf.org/html/rfc4291 "check the specification")
