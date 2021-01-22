# Untitled string in Secrets Schema

```txt
https://ns.adobe.com/helix/pipeline/secrets#/properties/DATA_EMBED_ALLOWLIST
```

Comma-separated list of allowed hostnames for data embeds. Supports `*.example.com` as a subdomain wildcard. Use `*` to allow all embeds (potentially insecure and conflicting with `EMBED_ALLOWLIST`)

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                         |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [secrets.schema.json*](secrets.schema.json "open original schema") |

## DATA_EMBED_ALLOWLIST Type

`string`

## DATA_EMBED_ALLOWLIST Default Value

The default value is:

```json
"docs.google.com, *.sharepoint.com"
```
