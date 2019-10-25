# MDAST Schema

```
https://ns.adobe.com/helix/pipeline/mdast
```

A node in the Markdown AST

| Abstract            | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In                             |
| ------------------- | ---------- | ------ | ------------ | ----------------- | --------------------- | -------------------------------------- |
| Can be instantiated | No         | Stable | No           | Forbidden         | Forbidden             | [mdast.schema.json](mdast.schema.json) |

## Schema Hierarchy

- MDAST `https://ns.adobe.com/helix/pipeline/mdast`
  - [Position](position.schema.md) `https://ns.adobe.com/helix/pipeline/position`
  - [Meta](meta.schema.md) `https://ns.adobe.com/helix/pipeline/meta`

# MDAST Properties

| Property                        | Type       | Required | Nullable | Defined by          |
| ------------------------------- | ---------- | -------- | -------- | ------------------- |
| [align](#align)                 | `enum[]`   | Optional | No       | MDAST (this schema) |
| [alt](#alt)                     | `string`   | Optional | Yes      | MDAST (this schema) |
| [checked](#checked)             | `boolean`  | Optional | Yes      | MDAST (this schema) |
| [children](#children)           | `array`    | Optional | No       | MDAST (this schema) |
| [code](#code)                   | `string`   | Optional | No       | MDAST (this schema) |
| [data](#data)                   | `object`   | Optional | No       | MDAST (this schema) |
| [depth](#depth)                 | `integer`  | Optional | No       | MDAST (this schema) |
| [identifier](#identifier)       | `string`   | Optional | No       | MDAST (this schema) |
| [image](#image)                 | `string`   | Optional | Yes      | MDAST (this schema) |
| [intro](#intro)                 | `string`   | Optional | Yes      | MDAST (this schema) |
| [label](#label)                 | `string`   | Optional | No       | MDAST (this schema) |
| [lang](#lang)                   | `string`   | Optional | Yes      | MDAST (this schema) |
| [meta](#meta)                   | `object`   | Optional | Yes      | MDAST (this schema) |
| [ordered](#ordered)             | `boolean`  | Optional | No       | MDAST (this schema) |
| [payload](#payload)             | `object`   | Optional | No       | MDAST (this schema) |
| [position](#position)           | Position   | Optional | No       | MDAST (this schema) |
| [referenceType](#referencetype) | `enum`     | Optional | No       | MDAST (this schema) |
| [spread](#spread)               | `boolean`  | Optional | Yes      | MDAST (this schema) |
| [start](#start)                 | `integer`  | Optional | Yes      | MDAST (this schema) |
| [title](#title)                 | `string`   | Optional | Yes      | MDAST (this schema) |
| [type](#type)                   | `enum`     | Optional | No       | MDAST (this schema) |
| [types](#types)                 | `string[]` | Optional | No       | MDAST (this schema) |
| [url](#url)                     | `string`   | Optional | No       | MDAST (this schema) |
| [value](#value)                 | `string`   | Optional | No       | MDAST (this schema) |

## align

For tables, an align field can be present. If present, it must be a list of alignTypes. It represents how cells in
columns are aligned.

`align`

- is optional
- type: `enum[]`
- defined in this schema

### align Type

Array type: `enum[]`

All items must be of the type: Unknown type `null,string`.

```json
{
  "description": "For tables, an align field can be present. If present, it must be a list of alignTypes. It represents how cells in columns are aligned.",
  "type": "array",
  "items": {
    "type": ["null", "string"],
    "enum": ["left", "right", "center", null],
    "simpletype": "`enum`",
    "meta:enum": {
      "left": "",
      "right": "",
      "center": "",
      "null": ""
    }
  },
  "simpletype": "`enum[]`"
}
```

## alt

An alt field should be present. It represents equivalent content for environments that cannot represent the node as
intended.

`alt`

- is optional
- type: `string`
- defined in this schema

### alt Type

`string`, nullable

## checked

A checked field can be present. It represents whether the item is done (when true), not done (when false), or
indeterminate or not applicable (when null or not present).

`checked`

- is optional
- type: `boolean`
- defined in this schema

### checked Type

`boolean` , nullable

## children

`children`

- is optional
- type: `array`
- defined in this schema

### children Type

Array type: `array`

All items must be of the type:

**One** of the following _conditions_ need to be fulfilled.

#### Condition 1

- []() – `https://ns.adobe.com/helix/pipeline/mdast`

#### Condition 2

- []() – `https://ns.adobe.com/helix/pipeline/section#/definitions/section`

## code

Icon code

`code`

- is optional
- type: `string`
- defined in this schema

### code Type

`string`

All instances must conform to this regular expression (test examples
[here](https://regexr.com/?expression=%3A%5Ba-zA-Z0-9_-%5D%2B%3A)):

```regex
:[a-zA-Z0-9_-]+:
```

## data

data is guaranteed to never be specified by unist or specifications implementing unist. Free data space.

`data`

- is optional
- type: `object`
- defined in this schema

### data Type

`object` with following properties:

| Property | Type | Required |
| -------- | ---- | -------- |


## depth

The heading level

`depth`

- is optional
- type: `integer`
- defined in this schema

### depth Type

`integer`

- minimum value: `1`
- maximum value: `6`

## identifier

For associations, an identifier field must be present. It can match an identifier field on another node.

`identifier`

- is optional
- type: `string`
- defined in this schema

### identifier Type

`string`

## image

Path (can be relative) to the first image in the document

`image`

- is optional
- type: `string`
- defined in this schema

### image Type

`string`, nullable

- format: `uri-reference` – URI Reference (according to [RFC3986](https://tools.ietf.org/html/rfc3986))

## intro

Extracted first paragraph of the document

`intro`

- is optional
- type: `string`
- defined in this schema

### intro Type

`string`, nullable

## label

For associations, a label field can be present. It represents the original value of the normalised identifier field.

`label`

- is optional
- type: `string`
- defined in this schema

### label Type

`string`

## lang

For code, a lang field can be present. It represents the language of computer code being marked up.

`lang`

- is optional
- type: `string`
- defined in this schema

### lang Type

`string`, nullable

## meta

`meta`

- is optional
- type: `object`
- defined in this schema

### meta Type

`object`, nullable, with following properties:

| Property  | Type   | Required |
| --------- | ------ | -------- |
| `class`   | string | Optional |
| `image`   | string | Optional |
| `intro`   | string | Optional |
| `tagname` | string | Optional |
| `title`   | string | Optional |
| `types`   | array  | Optional |

#### class

The CSS class to use for the section instead of the default `hlx-section` one

`class`

- is optional
- type: `string`

##### class Type

`string`

#### image

Path (can be relative) to the first image in the document

`image`

- is optional
- type: `string`

##### image Type

`string`

- format: `uri-reference` – URI Reference (according to [RFC3986](https://tools.ietf.org/html/rfc3986))

#### intro

Extracted first paragraph of the document

`intro`

- is optional
- type: `string`

##### intro Type

`string`

#### tagname

The element tag name to use for the section instead of the default `div` one (i.e. `section`, `main`, `aside`)

`tagname`

- is optional
- type: `string`

##### tagname Type

`string`

#### title

Extracted title of the document

`title`

- is optional
- type: `string`

##### title Type

`string`

#### types

The inferred class names for the section

`types`

- is optional
- type: `string[]`

##### types Type

Array type: `string[]`

All items must be of the type: `string`

## ordered

Is the list ordered

`ordered`

- is optional
- type: `boolean`
- defined in this schema

### ordered Type

`boolean`

## payload

The payload of a frontmatter/yaml block

`payload`

- is optional
- type: `object`
- defined in this schema

### payload Type

`object` with following properties:

| Property | Type | Required |
| -------- | ---- | -------- |


## position

`position`

- is optional
- type: Position
- defined in this schema

### position Type

- [Position](position.schema.md) – `https://ns.adobe.com/helix/pipeline/position`

## referenceType

Represents the explicitness of a reference.

`referenceType`

- is optional
- type: `enum`
- defined in this schema

The value of this property **must** be equal to one of the [known values below](#referencetype-known-values).

### referenceType Known Values

| Value       | Description                                                         |
| ----------- | ------------------------------------------------------------------- |
| `shortcut`  | the reference is implicit, its identifier inferred from its content |
| `collapsed` | the reference is explicit, its identifier inferred from its content |
| `full`      | the reference is explicit, its identifier explicitly set            |

## spread

A spread field can be present. It represents that any of its items is separated by a blank line from its siblings or
contains two or more children (when true), or not (when false or not present).

`spread`

- is optional
- type: `boolean`
- defined in this schema

### spread Type

`boolean` , nullable

## start

Starting item of the list

`start`

- is optional
- type: `integer`
- defined in this schema

### start Type

`integer`, nullable

## title

Extracted title of the document

`title`

- is optional
- type: `string`
- defined in this schema

### title Type

`string`, nullable

## type

The node type of the MDAST node

`type`

- is optional
- type: `enum`
- defined in this schema

The value of this property **must** be equal to one of the [known values below](#type-known-values).

### type Known Values

| Value                | Description                                                                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`               | The root node, representing a document or section                                                                                                                    |
| `paragraph`          | A paragraph. Note: standalone `image` blocks are often wrapped in a `paragraph`                                                                                      |
| `text`               | Plain text                                                                                                                                                           |
| `heading`            | A heading with heading level                                                                                                                                         |
| `thematicBreak`      | A section break                                                                                                                                                      |
| `blockquote`         | A blockquote                                                                                                                                                         |
| `list`               | An ordered or unordered list                                                                                                                                         |
| `table`              | A table                                                                                                                                                              |
| `tableRow`           | A row in a table                                                                                                                                                     |
| `tableCell`          | A cell in a table                                                                                                                                                    |
| `html`               | Raw HTML embedded in Markdown. Disabled by default.                                                                                                                  |
| `code`               | A code block                                                                                                                                                         |
| `yaml`               | A metadata block. If the block is not at the top of the document, it will start a new section.                                                                       |
| `definition`         | A definition that can be referenced                                                                                                                                  |
| `footnoteDefinition` | A footnote                                                                                                                                                           |
| `emphasis`           | emphasis (often in italics)                                                                                                                                          |
| `strong`             | strong (often in bold type)                                                                                                                                          |
| `delete`             | deleted content                                                                                                                                                      |
| `inlineCode`         | inline code                                                                                                                                                          |
| `break`              | A line break                                                                                                                                                         |
| `link`               | A hyperlink                                                                                                                                                          |
| `image`              | An image                                                                                                                                                             |
| `linkReference`      | A pointer to a link                                                                                                                                                  |
| `imageReference`     | A pointer to an image                                                                                                                                                |
| `footnote`           | A footnote                                                                                                                                                           |
| `footnoteReference`  | A reference to a footnote                                                                                                                                            |
| `embed`              | Content embedded from another page, identified by the `url` attribute.                                                                                               |
| `section`            | A section within the document. Sections serve as a high-level structure of a single markdown document and can have their own section-specific front matter metadata. |
| `icon`               | An SVG icon, identified by the syntax `:foo:`                                                                                                                        |
| `listItem`           |                                                                                                                                                                      |

## types

The inferred class names for the section

`types`

- is optional
- type: `string[]`
- defined in this schema

### types Type

Array type: `string[]`

All items must be of the type: `string`

## url

For resources, an url field must be present. It represents a URL to the referenced resource.

`url`

- is optional
- type: `string`
- defined in this schema

### url Type

`string`

- format: `uri-reference` – URI Reference (according to [RFC3986](https://tools.ietf.org/html/rfc3986))

## value

The string value of the node, if it is a terminal node.

`value`

- is optional
- type: `string`
- defined in this schema

### value Type

`string`
