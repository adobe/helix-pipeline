
# Context Schema

```
https://ns.adobe.com/helix/pipeline/context
```

The context thingie.

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Stabilizing | No | Forbidden | Forbidden | [context.schema.json](context.schema.json) |
## Schema Hierarchy

* Context `https://ns.adobe.com/helix/pipeline/context`
  * [Request](request.schema.md) `https://ns.adobe.com/helix/pipeline/request`
  * [Content](content.schema.md) `https://ns.adobe.com/helix/pipeline/content`
  * [Response](response.schema.md) `https://ns.adobe.com/helix/pipeline/response`


# Context Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [content](#content) | Content | Optional | Context (this schema) |
| [error](#error) | complex | Optional | Context (this schema) |
| [request](#request) | Request | Optional | Context (this schema) |
| [response](#response) | Response | Optional | Context (this schema) |

## content


`content`

* is optional
* type: Content
* defined in this schema

### content Type


* [Content](content.schema.md) – `https://ns.adobe.com/helix/pipeline/content`





## error

An error message that has been generated during pipeline processing.
When this property is present, all other values can be ignored.

`error`

* is optional
* type: complex
* defined in this schema

### error Type

Unknown type `string,object`.

```json
{
  "type": [
    "string",
    "object"
  ],
  "description": "An error message that has been generated during pipeline processing.\nWhen this property is present, all other values can be ignored.",
  "simpletype": "complex"
}
```





## request


`request`

* is optional
* type: Request
* defined in this schema

### request Type


* [Request](request.schema.md) – `https://ns.adobe.com/helix/pipeline/request`





## response


`response`

* is optional
* type: Response
* defined in this schema

### response Type


* [Response](response.schema.md) – `https://ns.adobe.com/helix/pipeline/response`




