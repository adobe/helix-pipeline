# Untitled object in Request Schema

```txt
https://ns.adobe.com/helix/pipeline/request#/properties/params
```

The passed through (and filtered) URL parameters of the request.


| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | ---------- | -------------- | ----------------------- | :---------------- | --------------------- | ------------------- | ------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [request.schema.json\*](request.schema.json "open original schema") |

## params Type

`object` ([Details](request-properties-params.md))

# undefined Properties

| Property              | Type   | Required | Nullable       | Defined by                                                                                                                                              |
| :-------------------- | ------ | -------- | -------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Additional Properties | Merged | Optional | cannot be null | [Request](request-properties-params-additionalproperties.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/params/additionalProperties") |

## Additional Properties

Additional properties are allowed, as long as they follow this schema:




-   is optional
-   Type: merged type ([Details](request-properties-params-additionalproperties.md))
-   cannot be null
-   defined in: [Request](request-properties-params-additionalproperties.md "https&#x3A;//ns.adobe.com/helix/pipeline/request#/properties/params/additionalProperties")

### additionalProperties Type

merged type ([Details](request-properties-params-additionalproperties.md))

any of

-   [Untitled string in Request](request-properties-params-additionalproperties-anyof-0.md "check type definition")
-   [Untitled array in Request](request-properties-params-additionalproperties-anyof-1.md "check type definition")
