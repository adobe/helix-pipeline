# Context Schema

```txt
https://ns.adobe.com/helix/pipeline/context
```

The context thingie.


| Abstract            | Extensible | Status      | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                        |
| :------------------ | ---------- | ----------- | ------------ | :---------------- | --------------------- | ------------------- | ----------------------------------------------------------------- |
| Can be instantiated | No         | Stabilizing | No           | Forbidden         | Forbidden             | none                | [context.schema.json](context.schema.json "open original schema") |

## Context Type

`object` ([Context](context.md))

# Context Properties

| Property              | Type         | Required | Nullable       | Defined by                                                                                                         |
| :-------------------- | ------------ | -------- | -------------- | :----------------------------------------------------------------------------------------------------------------- |
| [error](#error)       | Unknown Type | Optional | cannot be null | [Context](context-properties-error.md "https&#x3A;//ns.adobe.com/helix/pipeline/context#/properties/error")        |
| [request](#request)   | `object`     | Optional | cannot be null | [Context](context-properties-request.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/request")    |
| [content](#content)   | `object`     | Optional | cannot be null | [Context](context-properties-content.md "https&#x3A;//ns.adobe.com/helix/pipeline/content#/properties/content")    |
| [response](#response) | `object`     | Optional | cannot be null | [Context](context-properties-response.md "https&#x3A;//ns.adobe.com/helix/pipeline/response#/properties/response") |

## error

An error message that has been generated during pipeline processing.
When this property is present, all other values can be ignored.


`error`

-   is optional
-   Type: any of the folllowing: `string` or `object` ([Details](context-properties-error.md))
-   cannot be null
-   defined in: [Context](context-properties-error.md "https&#x3A;//ns.adobe.com/helix/pipeline/context#/properties/error")

### error Type

any of the folllowing: `string` or `object` ([Details](context-properties-error.md))

## request

The HTTP Request


`request`

-   is optional
-   Type: `object` ([Request](context-properties-request.md))
-   cannot be null
-   defined in: [Context](context-properties-request.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/request")

### request Type

`object` ([Request](context-properties-request.md))

## content

The content as retrieved from the repository and enriched in the pipeline.


`content`

-   is optional
-   Type: `object` ([Content](context-properties-content.md))
-   cannot be null
-   defined in: [Context](context-properties-content.md "https&#x3A;//ns.adobe.com/helix/pipeline/content#/properties/content")

### content Type

`object` ([Content](context-properties-content.md))

## response

The HTTP response object


`response`

-   is optional
-   Type: `object` ([Response](context-properties-response.md))
-   cannot be null
-   defined in: [Context](context-properties-response.md "https&#x3A;//ns.adobe.com/helix/pipeline/response#/properties/response")

### response Type

`object` ([Response](context-properties-response.md))
