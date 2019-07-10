# Text Coordinates Schema

```
https://ns.adobe.com/helix/pipeline/textcoordinates
```

A position in a text document

| Abstract            | Extensible | Status      | Identifiable | Custom Properties | Additional Properties | Defined In                                                 |
| ------------------- | ---------- | ----------- | ------------ | ----------------- | --------------------- | ---------------------------------------------------------- |
| Can be instantiated | No         | Stabilizing | No           | Forbidden         | Forbidden             | [textcoordinates.schema.json](textcoordinates.schema.json) |

# Text Coordinates Properties

| Property          | Type     | Required | Nullable | Defined by                     |
| ----------------- | -------- | -------- | -------- | ------------------------------ |
| [column](#column) | `number` | Optional | No       | Text Coordinates (this schema) |
| [line](#line)     | `number` | Optional | No       | Text Coordinates (this schema) |
| [offset](#offset) | `number` | Optional | No       | Text Coordinates (this schema) |

## column

Column number

`column`

- is optional
- type: `number`
- defined in this schema

### column Type

`number`

## line

Line number

`line`

- is optional
- type: `number`
- defined in this schema

### line Type

`number`

## offset

Character in the entire document

`offset`

- is optional
- type: `number`
- defined in this schema

### offset Type

`number`
