
# Response Schema

```
https://ns.adobe.com/helix/pipeline/response
```

The HTTP response object

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Stabilizing | No | Forbidden | Forbidden | [response.schema.json](response.schema.json) |

# Response Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [body](#body) | complex | Optional | Response (this schema) |
| [headers](#headers) | complex | Optional | Response (this schema) |
| [status](#status) | `integer` | Optional | Response (this schema) |

## body


`body`

* is optional
* type: complex
* defined in this schema

### body Type


**Any** following *options* needs to be fulfilled.


#### Option 1



#### Option 2







## headers

The HTTP headers of the response

`headers`

* is optional
* type: complex
* defined in this schema

### headers Type

Unknown type ``.

```json
{
  "description": "The HTTP headers of the response",
  "additionalProperties": {
    "type": "string"
  },
  "simpletype": "complex"
}
```





## status

The HTTP status code

`status`

* is optional
* type: `integer`
* defined in this schema

### status Type


`integer`






