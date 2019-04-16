
# Request Schema

```
https://ns.adobe.com/helix/pipeline/request
```

The HTTP Request

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Stabilizing | No | Forbidden | Forbidden | [request.schema.json](request.schema.json) |

# Request Properties

| Property | Type | Required | Nullable | Defined by |
|----------|------|----------|----------|------------|
| [extension](#extension) | `string` | Optional  | No | Request (this schema) |
| [headers](#headers) | complex | Optional  | No | Request (this schema) |
| [method](#method) | `string` | Optional  | No | Request (this schema) |
| [params](#params) | `object` | Optional  | No | Request (this schema) |
| [path](#path) | `string` | Optional  | No | Request (this schema) |
| [pathInfo](#pathinfo) | `string` | Optional  | No | Request (this schema) |
| [rootPath](#rootpath) | `string` | Optional  | No | Request (this schema) |
| [selector](#selector) | `string` | Optional  | No | Request (this schema) |
| [url](#url) | `string` | Optional  | No | Request (this schema) |

## extension

The extension of the requested resource

`extension`

* is optional
* type: `string`
* defined in this schema

### extension Type


`string`






### extension Examples

```json
"html"
```

```json
"json"
```



## headers

The HTTP headers of the request. Note: all header names will be lower-case.

`headers`

* is optional
* type: complex
* defined in this schema

### headers Type

Unknown type ``.

```json
{
  "description": "The HTTP headers of the request. Note: all header names will be lower-case.",
  "additionalProperties": {
    "type": "string"
  },
  "simpletype": "complex"
}
```





## method

The HTTP method of the request. Note: method names can be lower-case.

`method`

* is optional
* type: `string`
* defined in this schema

### method Type


`string`




### method Known Values
| Value | Description |
|-------|-------------|
| `GET` | GET request |
| `POST` | POST request |
| `PUT` | PUT request (not handled by Helix) |
| `DELETE` | DELETE request (not handled by Helix) |




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






## path

The path of the client request URL

`path`

* is optional
* type: `string`
* defined in this schema

### path Type


`string`






### path Example

```json
"/docs/api/general/index.nav.html"
```


## pathInfo

The part of the client path that is relative to the rootPath

`pathInfo`

* is optional
* type: `string`
* defined in this schema

### pathInfo Type


`string`






### pathInfo Example

```json
"/general/index.nav.html"
```


## rootPath

The request root path of the current strain.

`rootPath`

* is optional
* type: `string`
* defined in this schema

### rootPath Type


`string`






### rootPath Example

```json
"/docs/api"
```


## selector

The selector (sub-type indicator)

`selector`

* is optional
* type: `string`
* defined in this schema

### selector Type


`string`






### selector Examples

```json
""
```

```json
"nav"
```



## url

The path and request parameters of the client request URL

`url`

* is optional
* type: `string`
* defined in this schema

### url Type


`string`






### url Example

```json
"/docs/api/general/index.nav.html?a=1"
```

