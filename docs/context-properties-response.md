# Response Schema

```txt
https://ns.adobe.com/helix/pipeline/response#/properties/response
```

The HTTP response object

| Abstract            | Extensible | Status      | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | :--------- | :---------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------ |
| Can be instantiated | No         | Stabilizing | No           | Forbidden         | Forbidden             | none                | [context.schema.json\*](context.schema.json "open original schema") |

## response Type

`object` ([Response](context-properties-response.md))

# response Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                      |
| :-------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------- |
| [status](#status)     | `integer`     | Optional | cannot be null | [Response](response-properties-status.md "https://ns.adobe.com/helix/pipeline/response#/properties/status")     |
| [body](#body)         | Merged        | Optional | cannot be null | [Response](response-properties-body.md "https://ns.adobe.com/helix/pipeline/response#/properties/body")         |
| [document](#document) | `object`      | Optional | cannot be null | [Response](response-properties-document.md "https://ns.adobe.com/helix/pipeline/response#/properties/document") |
| [headers](#headers)   | Not specified | Optional | cannot be null | [Response](response-properties-headers.md "https://ns.adobe.com/helix/pipeline/response#/properties/headers")   |

## status

The HTTP status code

`status`

*   is optional

*   Type: `integer`

*   cannot be null

*   defined in: [Response](response-properties-status.md "https://ns.adobe.com/helix/pipeline/response#/properties/status")

### status Type

`integer`

## body



`body`

*   is optional

*   Type: merged type ([Details](response-properties-body.md))

*   cannot be null

*   defined in: [Response](response-properties-body.md "https://ns.adobe.com/helix/pipeline/response#/properties/body")

### body Type

merged type ([Details](response-properties-body.md))

any of

*   [Untitled undefined type in Response](response-properties-body-anyof-0.md "check type definition")

*   [Untitled object in Response](response-properties-body-anyof-1.md "check type definition")

## document

The DOM-compatible representation of the response document

`document`

*   is optional

*   Type: `object` ([Details](response-properties-document.md))

*   cannot be null

*   defined in: [Response](response-properties-document.md "https://ns.adobe.com/helix/pipeline/response#/properties/document")

### document Type

`object` ([Details](response-properties-document.md))

## headers

The HTTP headers of the response

`headers`

*   is optional

*   Type: unknown

*   cannot be null

*   defined in: [Response](response-properties-headers.md "https://ns.adobe.com/helix/pipeline/response#/properties/headers")

### headers Type

unknown
