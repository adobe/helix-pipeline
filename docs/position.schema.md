
#  Schema

```
https://ns.adobe.com/helix/pipeline/position
```

Marks the position of an AST node in the original text flow

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Forbidden | [position.schema.json](position.schema.json) |
## Schema Hierarchy

*  `https://ns.adobe.com/helix/pipeline/position`
  * [textcoordinates.schema](textcoordinates.schema.md) `https://ns.adobe.com/helix/pipeline/textcoordinates`


#  Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [end](#end) | textcoordinates.schema | Optional |  (this schema) |
| [indent](#indent) | `array` | Optional |  (this schema) |
| [start](#start) | textcoordinates.schema | Optional |  (this schema) |

## end


`end`
* is optional
* type: textcoordinates.schema
* defined in this schema

### end Type


* [textcoordinates.schema](textcoordinates.schema.md) – `https://ns.adobe.com/helix/pipeline/textcoordinates`





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
* type: textcoordinates.schema
* defined in this schema

### start Type


* [textcoordinates.schema](textcoordinates.schema.md) – `https://ns.adobe.com/helix/pipeline/textcoordinates`




