# Position Schema

```txt
https://ns.adobe.com/helix/pipeline/position#/definitions/section/properties/position
```

Marks the position of an AST node in the original text flow

| Abstract            | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | :--------- | :----- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------ |
| Can be instantiated | No         | Stable | No           | Forbidden         | Forbidden             | none                | [section.schema.json\*](section.schema.json "open original schema") |

## position Type

`object` ([Position](mdast-properties-position.md))

# position Properties

| Property          | Type     | Required | Nullable       | Defined by                                                                                                                  |
| :---------------- | :------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| [start](#start)   | `object` | Optional | cannot be null | [Position](position-properties-text-coordinates.md "https://ns.adobe.com/helix/pipeline/textcoordinates#/properties/start") |
| [end](#end)       | `object` | Optional | cannot be null | [Position](position-properties-text-coordinates-1.md "https://ns.adobe.com/helix/pipeline/textcoordinates#/properties/end") |
| [indent](#indent) | `array`  | Optional | cannot be null | [Position](position-properties-indent.md "https://ns.adobe.com/helix/pipeline/position#/properties/indent")                 |

## start

A position in a text document

`start`

*   is optional

*   Type: `object` ([Text Coordinates](position-properties-text-coordinates-1.md))

*   cannot be null

*   defined in: [Position](position-properties-text-coordinates-1.md "https://ns.adobe.com/helix/pipeline/textcoordinates#/properties/start")

### start Type

`object` ([Text Coordinates](position-properties-text-coordinates-1.md))

## end

A position in a text document

`end`

*   is optional

*   Type: `object` ([Text Coordinates](position-properties-text-coordinates-1.md))

*   cannot be null

*   defined in: [Position](position-properties-text-coordinates-1.md "https://ns.adobe.com/helix/pipeline/textcoordinates#/properties/end")

### end Type

`object` ([Text Coordinates](position-properties-text-coordinates-1.md))

## indent



`indent`

*   is optional

*   Type: `array`

*   cannot be null

*   defined in: [Position](position-properties-indent.md "https://ns.adobe.com/helix/pipeline/position#/properties/indent")

### indent Type

`array`
