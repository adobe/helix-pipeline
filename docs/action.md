# Action Schema

```txt
https://ns.adobe.com/helix/pipeline/action
```

Tracks the OpenWhisk action invocation


| Abstract            | Extensible | Status      | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                      |
| :------------------ | ---------- | ----------- | ------------ | :---------------- | --------------------- | ------------------- | --------------------------------------------------------------- |
| Can be instantiated | No         | Stabilizing | No           | Forbidden         | Forbidden             | none                | [action.schema.json](action.schema.json "open original schema") |

## Action Type

`object` ([Action](action.md))

# Action Properties

| Property                      | Type     | Required | Nullable       | Defined by                                                                                                             |
| :---------------------------- | -------- | -------- | -------------- | :--------------------------------------------------------------------------------------------------------------------- |
| [request](#request)           | Merged   | Optional | cannot be null | [Action](action-properties-raw-request.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/properties/request")   |
| [logger](#logger)             | `object` | Optional | cannot be null | [Action](action-properties-logger.md "https&#x3A;//ns.adobe.com/helix/pipeline/action#/properties/logger")             |
| [debug](#debug)               | `object` | Optional | cannot be null | [Action](action-properties-debug.md "https&#x3A;//ns.adobe.com/helix/pipeline/action#/properties/debug")               |
| [secrets](#secrets)           | `object` | Optional | cannot be null | [Action](action-properties-secrets.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/secrets")          |
| [transformer](#transformer)   | `object` | Optional | cannot be null | [Action](action-properties-transformer.md "https&#x3A;//ns.adobe.com/helix/pipeline/action#/properties/transformer")   |
| [downloader](#downloader)     | `object` | Optional | cannot be null | [Action](action-properties-downloader.md "https&#x3A;//ns.adobe.com/helix/pipeline/action#/properties/downloader")     |
| [versionLock](#versionLock)   | `object` | Optional | cannot be null | [Action](action-properties-versionlock.md "https&#x3A;//ns.adobe.com/helix/pipeline/action#/properties/versionLock")   |
| [markupconfig](#markupconfig) | `object` | Optional | cannot be null | [Action](action-properties-markupconfig.md "https&#x3A;//ns.adobe.com/helix/pipeline/action#/properties/markupconfig") |

## request

The Request Object used for Invoking OpenWhisk


`request`

-   is optional
-   Type: `object` ([Raw Request](action-properties-raw-request.md))
-   cannot be null
-   defined in: [Action](action-properties-raw-request.md "https&#x3A;//ns.adobe.com/helix/pipeline/rawrequest#/properties/request")

### request Type

`object` ([Raw Request](action-properties-raw-request.md))

all of

-   [Untitled undefined type in Raw Request](rawrequest-definitions-rawrequest.md "check type definition")

## logger

A helix-log [SimpleInterface](https://github.com/adobe/helix-log) logger instance.


`logger`

-   is optional
-   Type: `object` ([Details](action-properties-logger.md))
-   cannot be null
-   defined in: [Action](action-properties-logger.md "https&#x3A;//ns.adobe.com/helix/pipeline/action#/properties/logger")

### logger Type

`object` ([Details](action-properties-logger.md))

## debug

Internal information related to debugging.


`debug`

-   is optional
-   Type: `object` ([Details](action-properties-debug.md))
-   cannot be null
-   defined in: [Action](action-properties-debug.md "https&#x3A;//ns.adobe.com/helix/pipeline/action#/properties/debug")

### debug Type

`object` ([Details](action-properties-debug.md))

## secrets

Secrets passed into the pipeline such as API Keys or configuration settings.


`secrets`

-   is optional
-   Type: `object` ([Secrets](action-properties-secrets.md))
-   cannot be null
-   defined in: [Action](action-properties-secrets.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/secrets")

### secrets Type

`object` ([Secrets](action-properties-secrets.md))

## transformer

A VDOMTransformer instance


`transformer`

-   is optional
-   Type: `object` ([Details](action-properties-transformer.md))
-   cannot be null
-   defined in: [Action](action-properties-transformer.md "https&#x3A;//ns.adobe.com/helix/pipeline/action#/properties/transformer")

### transformer Type

`object` ([Details](action-properties-transformer.md))

## downloader

A Downloader instance


`downloader`

-   is optional
-   Type: `object` ([Details](action-properties-downloader.md))
-   cannot be null
-   defined in: [Action](action-properties-downloader.md "https&#x3A;//ns.adobe.com/helix/pipeline/action#/properties/downloader")

### downloader Type

`object` ([Details](action-properties-downloader.md))

## versionLock

A VersionLock instance


`versionLock`

-   is optional
-   Type: `object` ([Details](action-properties-versionlock.md))
-   cannot be null
-   defined in: [Action](action-properties-versionlock.md "https&#x3A;//ns.adobe.com/helix/pipeline/action#/properties/versionLock")

### versionLock Type

`object` ([Details](action-properties-versionlock.md))

## markupconfig

A [markup configuration](https://github.com/adobe/helix-shared/blob/master/docs/markup.md)


`markupconfig`

-   is optional
-   Type: `object` ([Details](action-properties-markupconfig.md))
-   cannot be null
-   defined in: [Action](action-properties-markupconfig.md "https&#x3A;//ns.adobe.com/helix/pipeline/action#/properties/markupconfig")

### markupconfig Type

`object` ([Details](action-properties-markupconfig.md))
