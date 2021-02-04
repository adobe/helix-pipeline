# Untitled undefined type in Raw Request Schema

```txt
https://ns.adobe.com/helix/pipeline/rawrequest#/allOf/0
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                               |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [rawrequest.schema.json*](rawrequest.schema.json "open original schema") |

## 0 Type

unknown

# 0 Properties

| Property            | Type     | Required | Nullable       | Defined by                                                                                                                                                         |
| :------------------ | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [headers](#headers) | `object` | Optional | cannot be null | [Raw Request](rawrequest-definitions-rawrequest-properties-headers.md "https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/headers") |
| [method](#method)   | `string` | Optional | cannot be null | [Raw Request](rawrequest-definitions-rawrequest-properties-method.md "https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/method")   |
| [params](#params)   | `object` | Optional | cannot be null | [Raw Request](rawrequest-definitions-rawrequest-properties-params.md "https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params")   |

## headers

The headers of the request made to OpenWhisk (or Simulator)

`headers`

*   is optional

*   Type: `object` ([Details](rawrequest-definitions-rawrequest-properties-headers.md))

*   cannot be null

*   defined in: [Raw Request](rawrequest-definitions-rawrequest-properties-headers.md "https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/headers")

### headers Type

`object` ([Details](rawrequest-definitions-rawrequest-properties-headers.md))

## method

The HTTP method of the request made to OpenWhisk (or Simulator). Note: OpenWhisk converts all methods to lowercase.

`method`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Raw Request](rawrequest-definitions-rawrequest-properties-method.md "https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/method")

### method Type

`string`

## params

Parameters used to invoke the OpenWhisk action. These are either URL parameters added when invoking the action from the CDN or default parameters set during creation of the action.

`params`

*   is optional

*   Type: `object` ([Details](rawrequest-definitions-rawrequest-properties-params.md))

*   cannot be null

*   defined in: [Raw Request](rawrequest-definitions-rawrequest-properties-params.md "https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params")

### params Type

`object` ([Details](rawrequest-definitions-rawrequest-properties-params.md))
