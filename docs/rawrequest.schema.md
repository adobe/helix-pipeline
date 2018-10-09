
# Raw Request Schema

```
https://ns.adobe.com/helix/pipeline/rawrequest
```

The Request Object used for Invoking OpenWhisk

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | Yes | Experimental | No | Forbidden | Permitted | [rawrequest.schema.json](rawrequest.schema.json) |

# Raw Request Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [params](#params) | `object` | Optional | Raw Request (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## params


`params`
* is optional
* type: `object`
* defined in this schema

### params Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `__ow_headers`| object | Optional |
| `owner`| string | Optional |
| `path`| string | Optional |
| `ref`| string | Optional |
| `repo`| string | Optional |



#### __ow_headers

Deprecated: The original OpenWhisk request headers

`__ow_headers`
* is optional
* type: `object`

##### __ow_headers Type

Unknown type `object`.

```json
{
  "type": "object",
  "description": "Deprecated: The original OpenWhisk request headers",
  "simpletype": "`object`"
}
```







#### owner

Owner of the GitHub repository. This is the name of a user or organization.

`owner`
* is optional
* type: `string`

##### owner Type


`string`








#### path

Path to the requested (Markdown) file

`path`
* is optional
* type: `string`

##### path Type


`string`








#### ref

Name of the branch or tag or the SHA of the commit

`ref`
* is optional
* type: `string`

##### ref Type


`string`








#### repo

Repository where content originates

`repo`
* is optional
* type: `string`

##### repo Type


`string`










