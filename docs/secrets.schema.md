# Secrets Schema

```
https://ns.adobe.com/helix/pipeline/secrets
```

Secrets passed into the pipeline such as API Keys or configuration settings.

| Abstract            | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In                                 |
| ------------------- | ---------- | ------ | ------------ | ----------------- | --------------------- | ------------------------------------------ |
| Can be instantiated | No         | Stable | No           | Forbidden         | Forbidden             | [secrets.schema.json](secrets.schema.json) |

# Secrets Properties

| Property                                          | Type      | Required | Nullable | Default                                                                 | Defined by            |
| ------------------------------------------------- | --------- | -------- | -------- | ----------------------------------------------------------------------- | --------------------- |
| [EMBED_SELECTOR](#embed_selector)                 | `string`  | Optional | No       | `"embed"`                                                               | Secrets (this schema) |
| [EMBED_SERVICE](#embed_service)                   | `string`  | Optional | No       | `"https://adobeioruntime.net/api/v1/web/helix/helix-services/embed@v1"` | Secrets (this schema) |
| [EMBED_WHITELIST](#embed_whitelist)               | `string`  | Optional | No       | `"www.youtube.com, spark.adobe.com, unsplash.com/photos"`               | Secrets (this schema) |
| [GITHUB_TOKEN](#github_token)                     | `string`  | Optional | No       | `""`                                                                    | Secrets (this schema) |
| [HTTP_TIMEOUT](#http_timeout)                     | `integer` | Optional | No       | `1000`                                                                  | Secrets (this schema) |
| [IMAGES_MIN_SIZE](#images_min_size)               | `integer` | Optional | No       | `480`                                                                   | Secrets (this schema) |
| [REPO_API_ROOT](#repo_api_root)                   | `string`  | Optional | No       | `"https://api.github.com/"`                                             | Secrets (this schema) |
| [REPO_RAW_ROOT](#repo_raw_root)                   | `string`  | Optional | No       | `"https://raw.githubusercontent.com/"`                                  | Secrets (this schema) |
| [RESOLVE_GITREF_SERVICE](#resolve_gitref_service) | `string`  | Optional | No       | `""`                                                                    | Secrets (this schema) |
| [SANITIZE_DOM](#sanitize_dom)                     | `boolean` | Optional | No       | `false`                                                                 | Secrets (this schema) |
| [TEST_BOOLEAN](#test_boolean)                     | `boolean` | Optional | No       | `true`                                                                  | Secrets (this schema) |
| [XML_PRETTY](#xml_pretty)                         | `boolean` | Optional | No       | `true`                                                                  | Secrets (this schema) |
| `[A-Z0-9_]+`                                      | multiple  | Pattern  | No       |                                                                         | Secrets (this schema) |

## EMBED_SELECTOR

Selector to be used when resolving internal embeds.

`EMBED_SELECTOR`

- is optional
- type: `string`
- default: `"embed"`
- defined in this schema

### EMBED_SELECTOR Type

`string`

## EMBED_SERVICE

URL of an Embed Service that takes the appended URL and returns an embeddable HTML representation.

`EMBED_SERVICE`

- is optional
- type: `string`
- default: `"https://adobeioruntime.net/api/v1/web/helix/helix-services/embed@v1"`
- defined in this schema

### EMBED_SERVICE Type

`string`

## EMBED_WHITELIST

Comma-separated list of allowed hostnames for embeds. Supports `*.example.com` as a subdomain wildcard. Use `*` to
allow all embeds (potentially insecure)

`EMBED_WHITELIST`

- is optional
- type: `string`
- default: `"www.youtube.com, spark.adobe.com, unsplash.com/photos"`
- defined in this schema

### EMBED_WHITELIST Type

`string`

## GITHUB_TOKEN

GitHub access token to use while fetching markdown. See
https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line.

`GITHUB_TOKEN`

- is optional
- type: `string`
- default: `""`
- defined in this schema

### GITHUB_TOKEN Type

`string`

## HTTP_TIMEOUT

Timeout for outgoing HTTP requests in milliseconds

`HTTP_TIMEOUT`

- is optional
- type: `integer`
- default: `1000`
- defined in this schema

### HTTP_TIMEOUT Type

`integer`

## IMAGES_MIN_SIZE

Minimum physical width of responsive images to generate

`IMAGES_MIN_SIZE`

- is optional
- type: `integer`
- default: `480`
- defined in this schema

### IMAGES_MIN_SIZE Type

`integer`

## REPO_API_ROOT

The base URL for all GitHub API operations

`REPO_API_ROOT`

- is optional
- type: `string`
- default: `"https://api.github.com/"`
- defined in this schema

### REPO_API_ROOT Type

`string`

- format: `uri` – Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))

## REPO_RAW_ROOT

The Base URL for retrieving raw text files from GitHub

`REPO_RAW_ROOT`

- is optional
- type: `string`
- default: `"https://raw.githubusercontent.com/"`
- defined in this schema

### REPO_RAW_ROOT Type

`string`

- format: `uri` – Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))

## RESOLVE_GITREF_SERVICE

API endpoint or action name to the service that resolves github refs to commit SHAs.

`RESOLVE_GITREF_SERVICE`

- is optional
- type: `string`
- default: `""`
- defined in this schema

### RESOLVE_GITREF_SERVICE Type

`string`

## SANITIZE_DOM

Sanitize the HTML output to guard against XSS attacks.

**Note:** this flag applies a pretty aggressive DOM filtering that will strip out a lot of HTML that your authors might
find useful. The setting is meant for processing truly untrusted inputs, such as comments in a social media site.

`SANITIZE_DOM`

- is optional
- type: `boolean`
- default: `false`
- defined in this schema

### SANITIZE_DOM Type

`boolean`

## TEST_BOOLEAN

`TEST_BOOLEAN`

- is optional
- type: `boolean`
- default: `true`
- defined in this schema

### TEST_BOOLEAN Type

`boolean`

## XML_PRETTY

Print XML with line breaks and indentation

`XML_PRETTY`

- is optional
- type: `boolean`
- default: `true`
- defined in this schema

### XML_PRETTY Type

`boolean`

## Pattern: `[A-Z0-9_]+`

Applies to all properties that match the regular expression `[A-Z0-9_]+`

`[A-Z0-9_]+`

- is a property pattern
- type: multiple
- defined in this schema

### Pattern [A-Z0-9_]+ Type

Unknown type `boolean,integer,number,string`.

```json
{
  "type": ["boolean", "integer", "number", "string"],
  "simpletype": "multiple"
}
```
