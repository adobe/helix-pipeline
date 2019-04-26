
# Secrets Schema

```
https://ns.adobe.com/helix/pipeline/secrets
```

Secrets passed into the pipeline such as API Keys or configuration settings.

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Stable | No | Forbidden | Forbidden | [secrets.schema.json](secrets.schema.json) |

# Secrets Properties

| Property | Type | Required | Nullable | Default | Defined by |
|----------|------|----------|----------|---------|------------|
| [EMBED_SELECTOR](#embed_selector) | `string` | Optional  | No | `"embed"` | Secrets (this schema) |
| [EMBED_SERVICE](#embed_service) | `string` | Optional  | No | `"https://adobeioruntime.net/api/v1/web/helix/default/embed/"` | Secrets (this schema) |
| [EMBED_WHITELIST](#embed_whitelist) | `string` | Optional  | No | `"www.youtube.com, spark.adobe.com, unsplash.com/photos"` | Secrets (this schema) |
| [HTTP_TIMEOUT](#http_timeout) | `integer` | Optional  | No | `1000` | Secrets (this schema) |
| [IMAGES_MAX_SIZE](#images_max_size) | `integer` | Optional  | No | `4096` | Secrets (this schema) |
| [IMAGES_MIN_SIZE](#images_min_size) | `integer` | Optional  | No | `480` | Secrets (this schema) |
| [IMAGES_SIZES](#images_sizes) | `string` | Optional  | No | `"100vw"` | Secrets (this schema) |
| [IMAGES_SIZE_STEPS](#images_size_steps) | `integer` | Optional  | No | `4` | Secrets (this schema) |
| [REPO_API_ROOT](#repo_api_root) | `string` | Optional  | No | `"https://api.github.com/"` | Secrets (this schema) |
| [REPO_RAW_ROOT](#repo_raw_root) | `string` | Optional  | No | `"https://raw.githubusercontent.com/"` | Secrets (this schema) |
| [TEST_BOOLEAN](#test_boolean) | `boolean` | Optional  | No | `true` | Secrets (this schema) |
| [XML_PRETTY](#xml_pretty) | `boolean` | Optional  | No | `true` | Secrets (this schema) |
| `[A-Z0-9_]+` | multiple | Pattern | No |  | Secrets (this schema) |

## EMBED_SELECTOR

Selector to be used when resolving internal embeds.

`EMBED_SELECTOR`

* is optional
* type: `string`
* default: `"embed"`
* defined in this schema

### EMBED_SELECTOR Type


`string`







## EMBED_SERVICE

URL of an Embed Service that takes the appended URL and returns an embeddable HTML representation.

`EMBED_SERVICE`

* is optional
* type: `string`
* default: `"https://adobeioruntime.net/api/v1/web/helix/default/embed/"`
* defined in this schema

### EMBED_SERVICE Type


`string`







## EMBED_WHITELIST

Comma-separated list of allowed hostnames for embeds. Supports `*.example.com` as a subdomain wildcard. Use `*` to allow all embeds (potentially insecure)

`EMBED_WHITELIST`

* is optional
* type: `string`
* default: `"www.youtube.com, spark.adobe.com, unsplash.com/photos"`
* defined in this schema

### EMBED_WHITELIST Type


`string`







## HTTP_TIMEOUT

Timeout for outgoing HTTP requests in milliseconds

`HTTP_TIMEOUT`

* is optional
* type: `integer`
* default: `1000`
* defined in this schema

### HTTP_TIMEOUT Type


`integer`







## IMAGES_MAX_SIZE

Maximum physical with of responsive images to generate

`IMAGES_MAX_SIZE`

* is optional
* type: `integer`
* default: `4096`
* defined in this schema

### IMAGES_MAX_SIZE Type


`integer`







## IMAGES_MIN_SIZE

Minimum physical width of responsive images to generate

`IMAGES_MIN_SIZE`

* is optional
* type: `integer`
* default: `480`
* defined in this schema

### IMAGES_MIN_SIZE Type


`integer`







## IMAGES_SIZES

Value for the `sizes` attribute of generated responsive images

`IMAGES_SIZES`

* is optional
* type: `string`
* default: `"100vw"`
* defined in this schema

### IMAGES_SIZES Type


`string`







## IMAGES_SIZE_STEPS

Number of intermediary size steps to create per image

`IMAGES_SIZE_STEPS`

* is optional
* type: `integer`
* default: `4`
* defined in this schema

### IMAGES_SIZE_STEPS Type


`integer`







## REPO_API_ROOT

The base URL for all GitHub API operations

`REPO_API_ROOT`

* is optional
* type: `string`
* default: `"https://api.github.com/"`
* defined in this schema

### REPO_API_ROOT Type


`string`

* format: `uri` – Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))






## REPO_RAW_ROOT

The Base URL for retrieving raw text files from GitHub

`REPO_RAW_ROOT`

* is optional
* type: `string`
* default: `"https://raw.githubusercontent.com/"`
* defined in this schema

### REPO_RAW_ROOT Type


`string`

* format: `uri` – Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))






## TEST_BOOLEAN


`TEST_BOOLEAN`

* is optional
* type: `boolean`
* default: `true`
* defined in this schema

### TEST_BOOLEAN Type


`boolean`





## XML_PRETTY

Print XML with line breaks and indentation

`XML_PRETTY`

* is optional
* type: `boolean`
* default: `true`
* defined in this schema

### XML_PRETTY Type


`boolean`





## Pattern: `[A-Z0-9_]+`
Applies to all properties that match the regular expression `[A-Z0-9_]+`


`[A-Z0-9_]+`

* is a property pattern
* type: multiple
* defined in this schema

### Pattern [A-Z0-9_]+ Type

Unknown type `boolean,integer,number,string`.

```json
{
  "type": [
    "boolean",
    "integer",
    "number",
    "string"
  ],
  "simpletype": "multiple"
}
```




