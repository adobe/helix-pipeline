
# MDAST Schema

```
https://ns.adobe.com/helix/pipeline/mdast
```

The Markdown AST is 100% API compatible with the [UnifiedJS MDAST](https://github.com/syntax-tree/mdast) data structure.

All [MDAST Utilities](https://github.com/syntax-tree/mdast#list-of-utilities) are compatible and can be used for easy processing of MDAST trees.

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Stable | No | Forbidden | Forbidden | [mdast.schema.json](mdast.schema.json) |
## Schema Hierarchy

* MDAST `https://ns.adobe.com/helix/pipeline/mdast`
  * [Position](position.schema.md) `https://ns.adobe.com/helix/pipeline/position`


# MDAST Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [align](#align) | `enum[]` | Optional | MDAST (this schema) |
| [alt](#alt) | complex | Optional | MDAST (this schema) |
| [checked](#checked) | complex | Optional | MDAST (this schema) |
| [children](#children) | MDAST | Optional | MDAST (this schema) |
| [depth](#depth) | `integer` | Optional | MDAST (this schema) |
| [identifier](#identifier) | `string` | Optional | MDAST (this schema) |
| [label](#label) | `string` | Optional | MDAST (this schema) |
| [lang](#lang) | `string` | Optional | MDAST (this schema) |
| [meta](#meta) | `string` | Optional | MDAST (this schema) |
| [ordered](#ordered) | `boolean` | Optional | MDAST (this schema) |
| [position](#position) | Position | Optional | MDAST (this schema) |
| [spread](#spread) | complex | Optional | MDAST (this schema) |
| [start](#start) | `integer` | Optional | MDAST (this schema) |
| [title](#title) | complex | Optional | MDAST (this schema) |
| [type](#type) | `enum` | Optional | MDAST (this schema) |
| [url](#url) | `string` | Optional | MDAST (this schema) |
| [value](#value) | `string` | Optional | MDAST (this schema) |

## align

For tables, an align field can be present. If present, it must be a list of alignTypes. It represents how cells in columns are aligned.

`align`
* is optional
* type: `enum[]`

* defined in this schema

### align Type


Array type: `enum[]`

All items must be of the type:
`string`









## alt

An alt field should be present. It represents equivalent content for environments that cannot represent the node as intended.

`alt`
* is optional
* type: complex
* defined in this schema

### alt Type

Unknown type `string,null`.

```json
{
  "type": [
    "string",
    "null"
  ],
  "description": "An alt field should be present. It represents equivalent content for environments that cannot represent the node as intended.",
  "simpletype": "complex"
}
```





## checked

A checked field can be present. It represents whether the item is done (when true), not done (when false), or indeterminate or not applicable (when null or not present).

`checked`
* is optional
* type: complex
* defined in this schema

### checked Type

Unknown type `null,boolean`.

```json
{
  "type": [
    "null",
    "boolean"
  ],
  "description": "A checked field can be present. It represents whether the item is done (when true), not done (when false), or indeterminate or not applicable (when null or not present).",
  "simpletype": "complex"
}
```





## children


`children`
* is optional
* type: MDAST

* defined in this schema

### children Type


Array type: MDAST

All items must be of the type:
* [MDAST](mdast.schema.md) – `https://ns.adobe.com/helix/pipeline/mdast`








## depth

The heading level

`depth`
* is optional
* type: `integer`
* defined in this schema

### depth Type


`integer`
* minimum value: `1`
* maximum value: `6`





## identifier

For associations, an identifier field must be present. It can match an identifier field on another node.

`identifier`
* is optional
* type: `string`
* defined in this schema

### identifier Type


`string`






## label

For associations, a label field can be present. It represents the original value of the normalised identifier field.

`label`
* is optional
* type: `string`
* defined in this schema

### label Type


`string`






## lang

For code, a lang field can be present. It represents the language of computer code being marked up.

`lang`
* is optional
* type: `string`
* defined in this schema

### lang Type


`string`






## meta

For code, if lang is present, a meta field can be present. It represents custom information relating to the node.

`meta`
* is optional
* type: `string`
* defined in this schema

### meta Type


`string`






## ordered

Is the list ordered

`ordered`
* is optional
* type: `boolean`
* defined in this schema

### ordered Type


`boolean`





## position


`position`
* is optional
* type: Position
* defined in this schema

### position Type


* [Position](position.schema.md) – `https://ns.adobe.com/helix/pipeline/position`





## spread

A spread field can be present. It represents that any of its items is separated by a blank line from its siblings or contains two or more children (when true), or not (when false or not present).

`spread`
* is optional
* type: complex
* defined in this schema

### spread Type

Unknown type `null,boolean`.

```json
{
  "type": [
    "null",
    "boolean"
  ],
  "description": "A spread field can be present. It represents that any of its items is separated by a blank line from its siblings or contains two or more children (when true), or not (when false or not present).",
  "simpletype": "complex"
}
```





## start

Starting item of the list

`start`
* is optional
* type: `integer`
* defined in this schema

### start Type


`integer`






## title

For resources, a title field can be present. It represents advisory information for the resource, such as would be appropriate for a tooltip.

`title`
* is optional
* type: complex
* defined in this schema

### title Type

Unknown type `string,null`.

```json
{
  "type": [
    "string",
    "null"
  ],
  "description": "For resources, a title field can be present. It represents advisory information for the resource, such as would be appropriate for a tooltip.",
  "simpletype": "complex"
}
```





## type

The node type of the MDAST node

`type`
* is optional
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#type-known-values).

### type Known Values
| Value | Description |
|-------|-------------|
| `root` |  |
| `paragraph` |  |
| `text` |  |
| `heading` |  |
| `thematicBreak` |  |
| `blockquote` |  |
| `list` |  |
| `listItem` |  |
| `table` |  |
| `tableRow` |  |
| `tableCell` |  |
| `html` |  |
| `code` |  |
| `yaml` |  |
| `definition` |  |
| `footnoteDefinition` |  |
| `emphasis` |  |
| `strong` |  |
| `delete` |  |
| `inlineCode` |  |
| `break` |  |
| `link` |  |
| `image` |  |
| `linkReference` |  |
| `imageReference` |  |
| `footnote` |  |
| `footnoteReference` |  |




## url

For resources, an url field must be present. It represents a URL to the referenced resource.

`url`
* is optional
* type: `string`
* defined in this schema

### url Type


`string`
* format: `uri-reference` – URI Reference (according to [RFC3986](https://tools.ietf.org/html/rfc3986))






## value

The string value of the node, if it is a terminal node.

`value`
* is optional
* type: `string`
* defined in this schema

### value Type


`string`





