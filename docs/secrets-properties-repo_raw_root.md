# Untitled string in Secrets Schema

```txt
https://ns.adobe.com/helix/pipeline/secrets#/properties/REPO_RAW_ROOT
```

The Base URL for retrieving raw text files from GitHub

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [secrets.schema.json\*](secrets.schema.json "open original schema") |

## REPO\_RAW\_ROOT Type

`string`

## REPO\_RAW\_ROOT Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")

## REPO\_RAW\_ROOT Default Value

The default value is:

```json
"https://raw.githubusercontent.com/"
```
