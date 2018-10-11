
# Request Schema

```
https://ns.adobe.com/helix/pipeline/request
```

The HTTP Request

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Stabilizing | No | Forbidden | Forbidden | [request.schema.json](request.schema.json) |

# Request Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [params](#params) | `object` | Optional | Request (this schema) |

## params

The passed through (and filtered) URL parameters of the request

`params`
* is optional
* type: `object`
* defined in this schema

### params Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|





