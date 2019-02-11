
# Position Schema

```
https://ns.adobe.com/helix/pipeline/position
```

Marks the position of an AST node in the original text flow

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Stable | No | Forbidden | Forbidden | [position.schema.json](position.schema.json) |
## Schema Hierarchy

* Position `https://ns.adobe.com/helix/pipeline/position`
  * [Text Coordinates](textcoordinates.schema.md) `https://ns.adobe.com/helix/pipeline/textcoordinates`


# Position Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [end](#end) | Text Coordinates | Optional | Position (this schema) |
| [indent](#indent) | `array` | Optional | Position (this schema) |
| [start](#start) | Text Coordinates | Optional | Position (this schema) |

## end


`end`
* is optional
* type: Text Coordinates
* defined in this schema

### end Type


* [Text Coordinates](textcoordinates.schema.md) – `https://ns.adobe.com/helix/pipeline/textcoordinates`





## indent


`indent`
* is optional
* type: `array`

* defined in this schema

### indent Type


Array type: `array`






## start


`start`
* is optional
* type: Text Coordinates
* defined in this schema

### start Type


* [Text Coordinates](textcoordinates.schema.md) – `https://ns.adobe.com/helix/pipeline/textcoordinates`




