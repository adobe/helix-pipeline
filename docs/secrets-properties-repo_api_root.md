# Untitled string in Secrets Schema

```txt
https://ns.adobe.com/helix/pipeline/secrets#/properties/REPO_API_ROOT
```

The base URL for all GitHub API operations

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [secrets.schema.json\*](secrets.schema.json "open original schema") |

## REPO\_API\_ROOT Type

`string`

## REPO\_API\_ROOT Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")

## REPO\_API\_ROOT Default Value

The default value is:

```json
"https://api.github.com/"
```
