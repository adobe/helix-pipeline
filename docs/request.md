# Request Schema

```txt
https://ns.adobe.com/helix/pipeline/request
```

The HTTP Request


| Abstract            | Extensible | Status      | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                        |
| :------------------ | ---------- | ----------- | ------------ | :---------------- | --------------------- | ------------------- | ----------------------------------------------------------------- |
| Can be instantiated | No         | Stabilizing | No           | Forbidden         | Forbidden             | none                | [request.schema.json](request.schema.json "open original schema") |

## Request Type

`object` ([Request](request.md))

# Request Properties

| Property                    | Type          | Required | Nullable       | Defined by                                                                                                              |
| :-------------------------- | ------------- | -------- | -------------- | :---------------------------------------------------------------------------------------------------------------------- |
| [url](#url)                 | `string`      | Optional | cannot be null | [Request](request-properties-url.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/url")                 |
| [path](#path)               | `string`      | Optional | cannot be null | [Request](request-properties-path.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/path")               |
| [pathInfo](#pathInfo)       | `string`      | Optional | cannot be null | [Request](request-properties-pathinfo.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/pathInfo")       |
| [rootPath](#rootPath)       | `string`      | Optional | cannot be null | [Request](request-properties-rootpath.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/rootPath")       |
| [selector](#selector)       | `string`      | Optional | cannot be null | [Request](request-properties-selector.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/selector")       |
| [extension](#extension)     | `string`      | Optional | cannot be null | [Request](request-properties-extension.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/extension")     |
| [method](#method)           | `string`      | Optional | cannot be null | [Request](request-properties-method.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/method")           |
| [headers](#headers)         | Not specified | Optional | cannot be null | [Request](request-properties-headers.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/headers")         |
| [params](#params)           | `object`      | Optional | cannot be null | [Request](request-properties-params.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/params")           |
| [queryString](#queryString) | `string`      | Optional | cannot be null | [Request](request-properties-querystring.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/queryString") |

## url

The path and request parameters of the client request URL


`url`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Request](request-properties-url.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/url")

### url Type

`string`

### url Examples

```json
"/docs/api/general/index.nav.html?a=1"
```

## path

The path of the client request URL


`path`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Request](request-properties-path.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/path")

### path Type

`string`

### path Examples

```json
"/docs/api/general/index.nav.html"
```

## pathInfo

The part of the client path that is relative to the rootPath


`pathInfo`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Request](request-properties-pathinfo.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/pathInfo")

### pathInfo Type

`string`

### pathInfo Examples

```json
"/general/index.nav.html"
```

## rootPath

The request root path of the current strain.


`rootPath`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Request](request-properties-rootpath.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/rootPath")

### rootPath Type

`string`

### rootPath Examples

```json
"/docs/api"
```

## selector

The selector (sub-type indicator)


`selector`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Request](request-properties-selector.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/selector")

### selector Type

`string`

### selector Examples

```json
""
```

```json
"nav"
```

## extension

The extension of the requested resource


`extension`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Request](request-properties-extension.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/extension")

### extension Type

`string`

### extension Examples

```json
"html"
```

```json
"json"
```

## method

The HTTP method of the request. Note: method names can be lower-case.


`method`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Request](request-properties-method.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/method")

### method Type

`string`

## headers

The HTTP headers of the request. Note: all header names will be lower-case.


`headers`

-   is optional
-   Type: unknown
-   cannot be null
-   defined in: [Request](request-properties-headers.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/headers")

### headers Type

unknown

## params

The passed through (and filtered) URL parameters of the request


`params`

-   is optional
-   Type: `object` ([Details](request-properties-params.md))
-   cannot be null
-   defined in: [Request](request-properties-params.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/params")

### params Type

`object` ([Details](request-properties-params.md))

## queryString

The original query string


`queryString`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Request](request-properties-querystring.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/queryString")

### queryString Type

`string`

### queryString Examples

```json
"?parameter1=foo&parameter2=bar"
```
