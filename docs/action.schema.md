
# Action Schema

```
https://ns.adobe.com/helix/pipeline/action
```

Tracks the OpenWhisk action invocation

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Stabilizing | No | Forbidden | Forbidden | [action.schema.json](action.schema.json) |
## Schema Hierarchy

* Action `https://ns.adobe.com/helix/pipeline/action`
  * [Raw Request](rawrequest.schema.md) `https://ns.adobe.com/helix/pipeline/rawrequest`
  * [Secrets](secrets.schema.md) `https://ns.adobe.com/helix/pipeline/secrets`


# Action Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [logger](#logger) | `object` | Optional | Action (this schema) |
| [request](#request) | Raw Request | Optional | Action (this schema) |
| [secrets](#secrets) | Secrets | Optional | Action (this schema) |

## logger

A [Winston](https://github.com/winstonjs/winston) logger instance.

`logger`
* is optional
* type: `object`
* defined in this schema

### logger Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|






## request


`request`
* is optional
* type: Raw Request
* defined in this schema

### request Type


* [Raw Request](rawrequest.schema.md) – `https://ns.adobe.com/helix/pipeline/rawrequest`





## secrets


`secrets`
* is optional
* type: Secrets
* defined in this schema

### secrets Type


* [Secrets](secrets.schema.md) – `https://ns.adobe.com/helix/pipeline/secrets`




