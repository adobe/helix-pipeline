# Untitled object in Raw Request Schema

```txt
https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params
```

Parameters used to invoke the OpenWhisk action. These are either URL parameters added when invoking the action from the CDN or default parameters set during creation of the action.


| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | ------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [rawrequest.schema.json\*](rawrequest.schema.json "open original schema") |

## params Type

`object` ([Details](rawrequest-definitions-rawrequest-properties-params.md))

# undefined Properties

| Property                        | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                              |
| :------------------------------ | -------- | -------- | -------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [owner](#owner)                 | `string` | Optional | cannot be null | [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-owner.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/owner")                 |
| [repo](#repo)                   | `string` | Optional | cannot be null | [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-repo.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/repo")                   |
| [ref](#ref)                     | `string` | Optional | cannot be null | [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-ref.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/ref")                     |
| [branch](#branch)               | `string` | Optional | cannot be null | [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-branch.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/branch")               |
| [path](#path)                   | `string` | Optional | cannot be null | [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-path.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/path")                   |
| [rootPath](#rootPath)           | `string` | Optional | cannot be null | [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-rootpath.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/rootPath")           |
| [strain](#strain)               | `string` | Optional | cannot be null | [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-strain.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/strain")               |
| [\_\_ow_headers](#__ow_headers) | `object` | Optional | cannot be null | [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-__ow_headers.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/\_\_ow_headers") |
| Additional Properties           | `string` | Optional | cannot be null | [Raw Request](rawrequest-definitions-rawrequest-properties-params-additionalproperties.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/additionalProperties")         |

## owner

Owner of the GitHub repository. This is the name of a user or organization.


`owner`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-owner.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/owner")

### owner Type

`string`

## repo

Repository where content originates


`repo`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-repo.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/repo")

### repo Type

`string`

## ref

Name of the branch or tag or the SHA of the commit


`ref`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-ref.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/ref")

### ref Type

`string`

## branch

Name of the branch or tag. defaults back to the value of 'ref' if missing.


`branch`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-branch.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/branch")

### branch Type

`string`

## path

Path to the requested (Markdown) file


`path`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-path.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/path")

### path Type

`string`

### path Examples

```json
"/general/index.md"
```

## rootPath

The request root path of the current strain.


`rootPath`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-rootpath.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/rootPath")

### rootPath Type

`string`

### rootPath Examples

```json
"/docs/api"
```

## strain

The resolved strain (variant)


`strain`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-strain.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/strain")

### strain Type

`string`

## \_\_ow_headers

Deprecated: The original OpenWhisk request headers


`__ow_headers`

-   is optional
-   Type: `object` ([Details](rawrequest-definitions-rawrequest-properties-params-properties-__ow_headers.md))
-   cannot be null
-   defined in: [Raw Request](rawrequest-definitions-rawrequest-properties-params-properties-__ow_headers.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/\_\_ow_headers")

### \_\_ow_headers Type

`object` ([Details](rawrequest-definitions-rawrequest-properties-params-properties-__ow_headers.md))

## Additional Properties

Additional properties are allowed, as long as they follow this schema:

All other parameters are interpreted as string.


-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Raw Request](rawrequest-definitions-rawrequest-properties-params-additionalproperties.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/additionalProperties")

### additionalProperties Type

`string`
