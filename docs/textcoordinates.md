# Text Coordinates Schema

```txt
https://ns.adobe.com/helix/pipeline/textcoordinates
```

A position in a text document


| Abstract            | Extensible | Status      | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                        |
| :------------------ | ---------- | ----------- | ------------ | :---------------- | --------------------- | ------------------- | --------------------------------------------------------------------------------- |
| Can be instantiated | No         | Stabilizing | No           | Forbidden         | Forbidden             | none                | [textcoordinates.schema.json](textcoordinates.schema.json "open original schema") |

## Text Coordinates Type

`object` ([Text Coordinates](textcoordinates.md))

# Text Coordinates Properties

| Property          | Type     | Required | Nullable       | Defined by                                                                                                                             |
| :---------------- | -------- | -------- | -------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| [line](#line)     | `number` | Optional | cannot be null | [Text Coordinates](textcoordinates-properties-line.md "https&#x3A;//ns.adobe.com/helix/pipeline/textcoordinates#/properties/line")     |
| [column](#column) | `number` | Optional | cannot be null | [Text Coordinates](textcoordinates-properties-column.md "https&#x3A;//ns.adobe.com/helix/pipeline/textcoordinates#/properties/column") |
| [offset](#offset) | `number` | Optional | cannot be null | [Text Coordinates](textcoordinates-properties-offset.md "https&#x3A;//ns.adobe.com/helix/pipeline/textcoordinates#/properties/offset") |

## line

Line number


`line`

-   is optional
-   Type: `number`
-   cannot be null
-   defined in: [Text Coordinates](textcoordinates-properties-line.md "https&#x3A;//ns.adobe.com/helix/pipeline/textcoordinates#/properties/line")

### line Type

`number`

## column

Column number


`column`

-   is optional
-   Type: `number`
-   cannot be null
-   defined in: [Text Coordinates](textcoordinates-properties-column.md "https&#x3A;//ns.adobe.com/helix/pipeline/textcoordinates#/properties/column")

### column Type

`number`

## offset

Character in the entire document


`offset`

-   is optional
-   Type: `number`
-   cannot be null
-   defined in: [Text Coordinates](textcoordinates-properties-offset.md "https&#x3A;//ns.adobe.com/helix/pipeline/textcoordinates#/properties/offset")

### offset Type

`number`
