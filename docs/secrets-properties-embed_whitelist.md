# Untitled string in Secrets Schema

```txt
https://ns.adobe.com/helix/pipeline/secrets#/properties/EMBED_WHITELIST
```

Comma-separated list of allowed hostnames for embeds. Supports `*.example.com` as a subdomain wildcard. Use `*` to allow all embeds (potentially insecure and conflicting with `DATA_EMBED_WHITELIST`)


| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | ---------- | -------------- | ----------------------- | :---------------- | --------------------- | ------------------- | ------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [secrets.schema.json\*](secrets.schema.json "open original schema") |

## EMBED_WHITELIST Type

`string`

## EMBED_WHITELIST Default Value

The default value is:

```json
"www.youtube.com, spark.adobe.com, unsplash.com, soundcloud.com, lottiefiles.com, www.slideshare.net"
```
