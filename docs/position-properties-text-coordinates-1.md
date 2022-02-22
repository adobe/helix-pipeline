# Text Coordinates Schema

```txt
https://ns.adobe.com/helix/pipeline/textcoordinates#/properties/start
```

A position in a text document

| Abstract            | Extensible | Status      | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                            |
| :------------------ | :--------- | :---------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------- |
| Can be instantiated | No         | Stabilizing | No           | Forbidden         | Forbidden             | none                | [position.schema.json\*](position.schema.json "open original schema") |

## start Type

`object` ([Text Coordinates](position-properties-text-coordinates-1.md))

# start Properties

| Property          | Type     | Required | Nullable       | Defined by                                                                                                                        |
| :---------------- | :------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| [line](#line)     | `number` | Optional | cannot be null | [Text Coordinates](textcoordinates-properties-line.md "https://ns.adobe.com/helix/pipeline/textcoordinates#/properties/line")     |
| [column](#column) | `number` | Optional | cannot be null | [Text Coordinates](textcoordinates-properties-column.md "https://ns.adobe.com/helix/pipeline/textcoordinates#/properties/column") |
| [offset](#offset) | `number` | Optional | cannot be null | [Text Coordinates](textcoordinates-properties-offset.md "https://ns.adobe.com/helix/pipeline/textcoordinates#/properties/offset") |

## line

Line number

`line`

*   is optional

*   Type: `number`

*   cannot be null

*   defined in: [Text Coordinates](textcoordinates-properties-line.md "https://ns.adobe.com/helix/pipeline/textcoordinates#/properties/line")

### line Type

`number`

## column

Column number

`column`

*   is optional

*   Type: `number`

*   cannot be null

*   defined in: [Text Coordinates](textcoordinates-properties-column.md "https://ns.adobe.com/helix/pipeline/textcoordinates#/properties/column")

### column Type

`number`

## offset

Character in the entire document

`offset`

*   is optional

*   Type: `number`

*   cannot be null

*   defined in: [Text Coordinates](textcoordinates-properties-offset.md "https://ns.adobe.com/helix/pipeline/textcoordinates#/properties/offset")

### offset Type

`number`
