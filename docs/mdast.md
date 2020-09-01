# MDAST Schema

```txt
https://ns.adobe.com/helix/pipeline/mdast
```

A node in the Markdown AST


| Abstract            | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                    |
| :------------------ | ---------- | ------ | ------------ | :---------------- | --------------------- | ------------------- | ------------------------------------------------------------- |
| Can be instantiated | No         | Stable | No           | Forbidden         | Forbidden             | none                | [mdast.schema.json](mdast.schema.json "open original schema") |

## MDAST Type

`object` ([MDAST](mdast.md))

# MDAST Properties

| Property                        | Type          | Required | Nullable       | Defined by                                                                                                                           |
| :------------------------------ | ------------- | -------- | -------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)                   | Not specified | Optional | cannot be null | [MDAST](mdast-properties-type.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/type")                                  |
| [children](#children)           | `array`       | Optional | cannot be null | [MDAST](mdast-properties-children.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/children")                          |
| [position](#position)           | `object`      | Optional | cannot be null | [MDAST](section-definitions-section-properties-position.md "https&#x3A;//ns.adobe.com/helix/pipeline/position#/properties/position") |
| [value](#value)                 | `string`      | Optional | cannot be null | [MDAST](mdast-properties-value.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/value")                                |
| [payload](#payload)             | `object`      | Optional | cannot be null | [MDAST](mdast-properties-payload.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/payload")                            |
| [depth](#depth)                 | `integer`     | Optional | cannot be null | [MDAST](mdast-properties-depth.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/depth")                                |
| [ordered](#ordered)             | `boolean`     | Optional | cannot be null | [MDAST](mdast-properties-ordered.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/ordered")                            |
| [start](#start)                 | `integer`     | Optional | can be null    | [MDAST](mdast-properties-start.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/start")                                |
| [spread](#spread)               | `boolean`     | Optional | can be null    | [MDAST](mdast-properties-spread.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/spread")                              |
| [checked](#checked)             | `boolean`     | Optional | can be null    | [MDAST](mdast-properties-checked.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/checked")                            |
| [align](#align)                 | `array`       | Optional | cannot be null | [MDAST](mdast-properties-align.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/align")                                |
| [lang](#lang)                   | `string`      | Optional | can be null    | [MDAST](mdast-properties-lang.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/lang")                                  |
| [identifier](#identifier)       | `string`      | Optional | cannot be null | [MDAST](mdast-properties-identifier.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/identifier")                      |
| [label](#label)                 | `string`      | Optional | cannot be null | [MDAST](mdast-properties-label.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/label")                                |
| [url](#url)                     | `string`      | Optional | cannot be null | [MDAST](mdast-properties-url.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/url")                                    |
| [meta](#meta)                   | `object`      | Optional | can be null    | [MDAST](meta-definitions-meta.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/meta")                                  |
| [title](#title)                 | `string`      | Optional | can be null    | [MDAST](mdast-properties-title.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/title")                                |
| [code](#code)                   | `string`      | Optional | cannot be null | [MDAST](mdast-properties-code.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/code")                                  |
| [intro](#intro)                 | `string`      | Optional | can be null    | [MDAST](mdast-properties-intro.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/intro")                                |
| [image](#image)                 | `string`      | Optional | can be null    | [MDAST](mdast-properties-image.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/image")                                |
| [types](#types)                 | `array`       | Optional | cannot be null | [MDAST](mdast-properties-types.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/types")                                |
| [alt](#alt)                     | `string`      | Optional | can be null    | [MDAST](mdast-properties-alt.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/alt")                                    |
| [referenceType](#referenceType) | Not specified | Optional | cannot be null | [MDAST](mdast-properties-referencetype.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/referenceType")                |
| [data](#data)                   | `object`      | Optional | cannot be null | [MDAST](mdast-properties-data.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/data")                                  |

## type

The node type of the MDAST node


`type`

-   is optional
-   Type: unknown
-   cannot be null
-   defined in: [MDAST](mdast-properties-type.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/type")

### type Type

unknown

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value                  | Explanation                                                                                                                                                          |
| :--------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"root"`               | The root node, representing a document or section                                                                                                                    |
| `"paragraph"`          | A paragraph. Note: standalone \`image\` blocks are often wrapped in a \`paragraph\`                                                                                  |
| `"text"`               | Plain text                                                                                                                                                           |
| `"heading"`            | A heading with heading level                                                                                                                                         |
| `"thematicBreak"`      | A section break                                                                                                                                                      |
| `"blockquote"`         | A blockquote                                                                                                                                                         |
| `"list"`               | An ordered or unordered list                                                                                                                                         |
| `"listItem"`           |                                                                                                                                                                      |
| `"table"`              | A table                                                                                                                                                              |
| `"tableRow"`           | A row in a table                                                                                                                                                     |
| `"tableCell"`          | A cell in a table                                                                                                                                                    |
| `"html"`               | Raw HTML embedded in Markdown. Disabled by default.                                                                                                                  |
| `"code"`               | A code block                                                                                                                                                         |
| `"yaml"`               | A metadata block. If the block is not at the top of the document, it will start a new section.                                                                       |
| `"definition"`         | A definition that can be referenced                                                                                                                                  |
| `"footnoteDefinition"` | A footnote                                                                                                                                                           |
| `"emphasis"`           | emphasis (often in italics)                                                                                                                                          |
| `"strong"`             | strong (often in bold type)                                                                                                                                          |
| `"delete"`             | deleted content                                                                                                                                                      |
| `"inlineCode"`         | inline code                                                                                                                                                          |
| `"break"`              | A line break                                                                                                                                                         |
| `"link"`               | A hyperlink                                                                                                                                                          |
| `"image"`              | An image                                                                                                                                                             |
| `"linkReference"`      | A pointer to a link                                                                                                                                                  |
| `"imageReference"`     | A pointer to an image                                                                                                                                                |
| `"footnote"`           | A footnote                                                                                                                                                           |
| `"footnoteReference"`  | A reference to a footnote                                                                                                                                            |
| `"embed"`              | Content embedded from another page, identified by the \`url\` attribute.                                                                                             |
| `"dataEmbed"`          | Data embedded from another data source (API), identified by the \`url\` attribute.                                                                                   |
| `"section"`            | A section within the document. Sections serve as a high-level structure of a single markdown document and can have their own section-specific front matter metadata. |
| `"icon"`               | An SVG icon, identified by the syntax \`:foo:\`                                                                                                                      |

## children




`children`

-   is optional
-   Type: an array of merged types ([Details](mdast-properties-children-items.md))
-   cannot be null
-   defined in: [MDAST](mdast-properties-children.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/children")

### children Type

an array of merged types ([Details](mdast-properties-children-items.md))

## position

Marks the position of an AST node in the original text flow


`position`

-   is optional
-   Type: `object` ([Position](section-definitions-section-properties-position.md))
-   cannot be null
-   defined in: [MDAST](section-definitions-section-properties-position.md "https&#x3A;//ns.adobe.com/helix/pipeline/position#/properties/position")

### position Type

`object` ([Position](section-definitions-section-properties-position.md))

## value

The string value of the node, if it is a terminal node.


`value`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [MDAST](mdast-properties-value.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/value")

### value Type

`string`

## payload

The payload of a frontmatter/yaml block


`payload`

-   is optional
-   Type: `object` ([Details](mdast-properties-payload.md))
-   cannot be null
-   defined in: [MDAST](mdast-properties-payload.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/payload")

### payload Type

`object` ([Details](mdast-properties-payload.md))

## depth

The heading level


`depth`

-   is optional
-   Type: `integer`
-   cannot be null
-   defined in: [MDAST](mdast-properties-depth.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/depth")

### depth Type

`integer`

### depth Constraints

**maximum**: the value of this number must smaller than or equal to: `6`

**minimum**: the value of this number must greater than or equal to: `1`

## ordered

Is the list ordered


`ordered`

-   is optional
-   Type: `boolean`
-   cannot be null
-   defined in: [MDAST](mdast-properties-ordered.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/ordered")

### ordered Type

`boolean`

## start

Starting item of the list


`start`

-   is optional
-   Type: `integer`
-   can be null
-   defined in: [MDAST](mdast-properties-start.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/start")

### start Type

`integer`

## spread

A spread field can be present. It represents that any of its items is separated by a blank line from its siblings or contains two or more children (when true), or not (when false or not present).


`spread`

-   is optional
-   Type: `boolean`
-   can be null
-   defined in: [MDAST](mdast-properties-spread.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/spread")

### spread Type

`boolean`

## checked

A checked field can be present. It represents whether the item is done (when true), not done (when false), or indeterminate or not applicable (when null or not present).


`checked`

-   is optional
-   Type: `boolean`
-   can be null
-   defined in: [MDAST](mdast-properties-checked.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/checked")

### checked Type

`boolean`

## align

For tables, an align field can be present. If present, it must be a list of alignTypes. It represents how cells in columns are aligned.


`align`

-   is optional
-   Type: `string[]`
-   cannot be null
-   defined in: [MDAST](mdast-properties-align.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/align")

### align Type

`string[]`

## lang

For code, a lang field can be present. It represents the language of computer code being marked up.


`lang`

-   is optional
-   Type: `string`
-   can be null
-   defined in: [MDAST](mdast-properties-lang.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/lang")

### lang Type

`string`

## identifier

For associations, an identifier field must be present. It can match an identifier field on another node.


`identifier`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [MDAST](mdast-properties-identifier.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/identifier")

### identifier Type

`string`

## label

For associations, a label field can be present. It represents the original value of the normalised identifier field.


`label`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [MDAST](mdast-properties-label.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/label")

### label Type

`string`

## url

For resources, an url field must be present. It represents a URL to the referenced resource.


`url`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [MDAST](mdast-properties-url.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/url")

### url Type

`string`

### url Constraints

**URI reference**: the string must be a URI reference, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")

## meta




`meta`

-   is optional
-   Type: `object` ([Details](meta-definitions-meta.md))
-   can be null
-   defined in: [MDAST](meta-definitions-meta.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/meta")

### meta Type

`object` ([Details](meta-definitions-meta.md))

## title

Extracted title of the document


`title`

-   is optional
-   Type: `string`
-   can be null
-   defined in: [MDAST](mdast-properties-title.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/title")

### title Type

`string`

## code

Icon code


`code`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [MDAST](mdast-properties-code.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/code")

### code Type

`string`

### code Constraints

**pattern**: the string must match the following regular expression: 

```regexp
:[a-zA-Z0-9_-]+:
```

[try pattern](https://regexr.com/?expression=%3A%5Ba-zA-Z0-9_-%5D%2B%3A "try regular expression with regexr.com")

## intro

Extracted first paragraph of the document


`intro`

-   is optional
-   Type: `string`
-   can be null
-   defined in: [MDAST](mdast-properties-intro.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/intro")

### intro Type

`string`

## image

Path (can be relative) to the first image in the document


`image`

-   is optional
-   Type: `string`
-   can be null
-   defined in: [MDAST](mdast-properties-image.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/image")

### image Type

`string`

### image Constraints

**URI reference**: the string must be a URI reference, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")

## types

The inferred class names for the section


`types`

-   is optional
-   Type: `string[]`
-   cannot be null
-   defined in: [MDAST](mdast-properties-types.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/types")

### types Type

`string[]`

## alt

An alt field should be present. It represents equivalent content for environments that cannot represent the node as intended.


`alt`

-   is optional
-   Type: `string`
-   can be null
-   defined in: [MDAST](mdast-properties-alt.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/alt")

### alt Type

`string`

## referenceType

Represents the explicitness of a reference.


`referenceType`

-   is optional
-   Type: unknown
-   cannot be null
-   defined in: [MDAST](mdast-properties-referencetype.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/referenceType")

### referenceType Type

unknown

### referenceType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value         | Explanation                                                         |
| :------------ | ------------------------------------------------------------------- |
| `"shortcut"`  | the reference is implicit, its identifier inferred from its content |
| `"collapsed"` | the reference is explicit, its identifier inferred from its content |
| `"full"`      | the reference is explicit, its identifier explicitly set            |

## data

data is guaranteed to never be specified by unist or specifications implementing unist. Free data space.


`data`

-   is optional
-   Type: `object` ([Details](mdast-properties-data.md))
-   cannot be null
-   defined in: [MDAST](mdast-properties-data.md "https&#x3A;//ns.adobe.com/helix/pipeline/mdast#/properties/data")

### data Type

`object` ([Details](mdast-properties-data.md))
