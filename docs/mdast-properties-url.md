# Untitled string in MDAST Schema

```txt
https://ns.adobe.com/helix/pipeline/mdast#/properties/url
```

For resources, an url field must be present. It represents a URL to the referenced resource.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                      |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [mdast.schema.json\*](mdast.schema.json "open original schema") |

## url Type

`string`

## url Constraints

**URI reference**: the string must be a URI reference, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")
