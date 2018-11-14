
# Secrets Schema

```
https://ns.adobe.com/helix/pipeline/secrets
```

Secrets passed into the pipeline such as API Keys or configuration settings.

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Stable | No | Forbidden | Forbidden | [secrets.schema.json](secrets.schema.json) |

# Secrets Properties

| Property | Type | Required | Default | Defined by |
|----------|------|----------|---------|------------|
| [EMBED_SERVICE](#embed_service) | `string` | Optional |  | Secrets (this schema) |
| [EMBED_WHITELIST](#embed_whitelist) | `string` | Optional |  | Secrets (this schema) |
| [IMAGES_MAX_SIZE](#images_max_size) | `string` | Optional |  | Secrets (this schema) |
| [IMAGES_MIN_SIZE](#images_min_size) | `string` | Optional |  | Secrets (this schema) |
| [IMAGES_SIZES](#images_sizes) | `string` | Optional |  | Secrets (this schema) |
| [IMAGES_SIZE_STEPS](#images_size_steps) | `string` | Optional |  | Secrets (this schema) |
| [REPO_RAW_ROOT](#repo_raw_root) | `string` | Optional | `"https://raw.githubusercontent.com/"` | Secrets (this schema) |
| `[A-Z0-9_]+` | `string` | Pattern |  | Secrets (this schema) |

## EMBED_SERVICE

URL of an Embed Service that takes the appended URL and returns an embeddable HTML representation.

`EMBED_SERVICE`
* is optional
* type: `string`
* defined in this schema

### EMBED_SERVICE Type


`string`






## EMBED_WHITELIST

Comma-separated list of allowed hostnames for embeds. Supports `*.example.com` as a subdomain wildcard. Use `*` to allow all embeds (potentially insecure)

`EMBED_WHITELIST`
* is optional
* type: `string`
* defined in this schema

### EMBED_WHITELIST Type


`string`






## IMAGES_MAX_SIZE

Maximum physical with of responsive images to generate

`IMAGES_MAX_SIZE`
* is optional
* type: `string`
* defined in this schema

### IMAGES_MAX_SIZE Type


`string`






## IMAGES_MIN_SIZE

Minimum physical width of responsive images to generate

`IMAGES_MIN_SIZE`
* is optional
* type: `string`
* defined in this schema

### IMAGES_MIN_SIZE Type


`string`






## IMAGES_SIZES

Value for the `sizes` attribute of generated responsive images

`IMAGES_SIZES`
* is optional
* type: `string`
* defined in this schema

### IMAGES_SIZES Type


`string`






## IMAGES_SIZE_STEPS

Number of intermediary size steps to create per image

`IMAGES_SIZE_STEPS`
* is optional
* type: `string`
* defined in this schema

### IMAGES_SIZE_STEPS Type


`string`






## REPO_RAW_ROOT

The Base URL for retrieving raw text files from GitHub

`REPO_RAW_ROOT`
* is optional
* type: `string`
* default: `"https://raw.githubusercontent.com/"`
* defined in this schema

### REPO_RAW_ROOT Type


`string`






## Pattern: `[A-Z0-9_]+`
Applies to all properties that match the regular expression `[A-Z0-9_]+`


`[A-Z0-9_]+`
* is a property pattern
* type: `string`
* defined in this schema

### Pattern [A-Z0-9_]+ Type


`string`





