
# Context Schema

```
https://ns.adobe.com/helix/pipeline/context
```

The context thingie.

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Forbidden | [context.schema.json](context.schema.json) |
## Schema Hierarchy

* Context `https://ns.adobe.com/helix/pipeline/context`
  * [request.schema](request.schema.md) `https://ns.adobe.com/helix/pipeline/request`
  * [Content](content.schema.md) `https://ns.adobe.com/helix/pipeline/content`
  * [response.schema](response.schema.md) `https://ns.adobe.com/helix/pipeline/response`


# Context Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [content](#content) | Content | Optional | Context (this schema) |
| [error](#error) | `string` | Optional | Context (this schema) |
| [request](#request) | request.schema | Optional | Context (this schema) |
| [response](#response) | response.schema | Optional | Context (this schema) |

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
* type: `string`
* defined in this schema

### error Type


`string`






## request


`request`
* is optional
* type: request.schema
* defined in this schema

### request Type


* [request.schema](request.schema.md) – `https://ns.adobe.com/helix/pipeline/request`





## response


`response`
* is optional
* type: response.schema
* defined in this schema

### response Type


* [response.schema](response.schema.md) – `https://ns.adobe.com/helix/pipeline/response`




