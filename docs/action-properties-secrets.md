# Secrets Schema

```txt
https://ns.adobe.com/helix/pipeline/secrets#/properties/secrets
```

Secrets passed into the pipeline such as API Keys or configuration settings.

| Abstract            | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                        |
| :------------------ | :--------- | :----- | :----------- | :---------------- | :-------------------- | :------------------ | :---------------------------------------------------------------- |
| Can be instantiated | No         | Stable | No           | Forbidden         | Forbidden             | none                | [action.schema.json\*](action.schema.json "open original schema") |

## secrets Type

`object` ([Secrets](action-properties-secrets.md))

# secrets Properties

| Property                                            | Type      | Required | Nullable       | Defined by                                                                                                                               |
| :-------------------------------------------------- | :-------- | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| [REPO\_RAW\_ROOT](#repo_raw_root)                   | `string`  | Optional | cannot be null | [Secrets](secrets-properties-repo_raw_root.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/REPO_RAW_ROOT")                   |
| [REPO\_API\_ROOT](#repo_api_root)                   | `string`  | Optional | cannot be null | [Secrets](secrets-properties-repo_api_root.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/REPO_API_ROOT")                   |
| [EMBED\_ALLOWLIST](#embed_allowlist)                | `string`  | Optional | cannot be null | [Secrets](secrets-properties-embed_allowlist.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/EMBED_ALLOWLIST")               |
| [DATA\_EMBED\_ALLOWLIST](#data_embed_allowlist)     | `string`  | Optional | cannot be null | [Secrets](secrets-properties-data_embed_allowlist.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/DATA_EMBED_ALLOWLIST")     |
| [EMBED\_SERVICE](#embed_service)                    | `string`  | Optional | cannot be null | [Secrets](secrets-properties-embed_service.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/EMBED_SERVICE")                   |
| [DATA\_EMBED\_SERVICE](#data_embed_service)         | `string`  | Optional | cannot be null | [Secrets](secrets-properties-data_embed_service.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/DATA_EMBED_SERVICE")         |
| [EMBED\_SELECTOR](#embed_selector)                  | `string`  | Optional | cannot be null | [Secrets](secrets-properties-embed_selector.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/EMBED_SELECTOR")                 |
| [IMAGES\_MIN\_SIZE](#images_min_size)               | `integer` | Optional | cannot be null | [Secrets](secrets-properties-images_min_size.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/IMAGES_MIN_SIZE")               |
| [HTTP\_TIMEOUT](#http_timeout)                      | `integer` | Optional | cannot be null | [Secrets](secrets-properties-http_timeout.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/HTTP_TIMEOUT")                     |
| [HTTP\_TIMEOUT\_EXTERNAL](#http_timeout_external)   | `integer` | Optional | cannot be null | [Secrets](secrets-properties-http_timeout_external.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/HTTP_TIMEOUT_EXTERNAL")   |
| [TEST\_BOOLEAN](#test_boolean)                      | `boolean` | Optional | cannot be null | [Secrets](secrets-properties-test_boolean.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/TEST_BOOLEAN")                     |
| [XML\_PRETTY](#xml_pretty)                          | `boolean` | Optional | cannot be null | [Secrets](secrets-properties-xml_pretty.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/XML_PRETTY")                         |
| [SANITIZE\_DOM](#sanitize_dom)                      | `boolean` | Optional | cannot be null | [Secrets](secrets-properties-sanitize_dom.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/SANITIZE_DOM")                     |
| [RESOLVE\_GITREF\_SERVICE](#resolve_gitref_service) | `string`  | Optional | cannot be null | [Secrets](secrets-properties-resolve_gitref_service.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/RESOLVE_GITREF_SERVICE") |
| [GITHUB\_TOKEN](#github_token)                      | `string`  | Optional | cannot be null | [Secrets](secrets-properties-github_token.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/GITHUB_TOKEN")                     |
| [CONTENT\_PROXY\_URL](#content_proxy_url)           | `string`  | Optional | cannot be null | [Secrets](secrets-properties-content_proxy_url.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/CONTENT_PROXY_URL")           |
| `[A-Z0-9_]+`                                        | Multiple  | Optional | cannot be null | [Secrets](secrets-patternproperties-a-z0-9_.md "https://ns.adobe.com/helix/pipeline/secrets#/patternProperties/\[A-Z0-9_]+")             |

## REPO\_RAW\_ROOT

The Base URL for retrieving raw text files from GitHub

`REPO_RAW_ROOT`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Secrets](secrets-properties-repo_raw_root.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/REPO_RAW_ROOT")

### REPO\_RAW\_ROOT Type

`string`

### REPO\_RAW\_ROOT Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")

### REPO\_RAW\_ROOT Default Value

The default value is:

```json
"https://raw.githubusercontent.com/"
```

## REPO\_API\_ROOT

The base URL for all GitHub API operations

`REPO_API_ROOT`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Secrets](secrets-properties-repo_api_root.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/REPO_API_ROOT")

### REPO\_API\_ROOT Type

`string`

### REPO\_API\_ROOT Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")

### REPO\_API\_ROOT Default Value

The default value is:

```json
"https://api.github.com/"
```

## EMBED\_ALLOWLIST

Comma-separated list of allowed hostnames for embeds. Supports `*.example.com` as a subdomain wildcard. Use `*` to allow all embeds (potentially insecure and conflicting with `DATA_EMBED_ALLOWLIST`)

`EMBED_ALLOWLIST`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Secrets](secrets-properties-embed_allowlist.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/EMBED_ALLOWLIST")

### EMBED\_ALLOWLIST Type

`string`

### EMBED\_ALLOWLIST Default Value

The default value is:

```json
"www.youtube.com, unsplash.com, soundcloud.com, lottiefiles.com, www.slideshare.net, vimeo.com, www.instagram.com, twitter.com, open.spotify.com, web.spotify.com, player.vimeo.com, www.linkedin.com, w.soundcloud.com, www.slideshare.net, youtu.be, media.giphy.com, video.tv.adobe.com, api.soundcloud.com, xd.adobe.com"
```

## DATA\_EMBED\_ALLOWLIST

Comma-separated list of allowed hostnames for data embeds. Supports `*.example.com` as a subdomain wildcard. Use `*` to allow all embeds (potentially insecure and conflicting with `EMBED_ALLOWLIST`)

`DATA_EMBED_ALLOWLIST`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Secrets](secrets-properties-data_embed_allowlist.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/DATA_EMBED_ALLOWLIST")

### DATA\_EMBED\_ALLOWLIST Type

`string`

### DATA\_EMBED\_ALLOWLIST Default Value

The default value is:

```json
"docs.google.com, *.sharepoint.com"
```

## EMBED\_SERVICE

URL of an Embed Service that takes the appended URL and returns an embeddable HTML representation.

`EMBED_SERVICE`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Secrets](secrets-properties-embed_service.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/EMBED_SERVICE")

### EMBED\_SERVICE Type

`string`

### EMBED\_SERVICE Default Value

The default value is:

```json
"https://helix-pages.anywhere.run/helix-services/embed@v1"
```

## DATA\_EMBED\_SERVICE

URL of a DataEmbed Service that takes the appended URL and returns an iterable JSON representation.

`DATA_EMBED_SERVICE`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Secrets](secrets-properties-data_embed_service.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/DATA_EMBED_SERVICE")

### DATA\_EMBED\_SERVICE Type

`string`

### DATA\_EMBED\_SERVICE Default Value

The default value is:

```json
"https://adobeioruntime.net/api/v1/web/helix/helix-services/data-embed@v2"
```

## EMBED\_SELECTOR

Selector to be used when resolving internal embeds.

`EMBED_SELECTOR`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Secrets](secrets-properties-embed_selector.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/EMBED_SELECTOR")

### EMBED\_SELECTOR Type

`string`

### EMBED\_SELECTOR Default Value

The default value is:

```json
"embed"
```

## IMAGES\_MIN\_SIZE

Minimum physical width of responsive images to generate

`IMAGES_MIN_SIZE`

*   is optional

*   Type: `integer`

*   cannot be null

*   defined in: [Secrets](secrets-properties-images_min_size.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/IMAGES_MIN_SIZE")

### IMAGES\_MIN\_SIZE Type

`integer`

### IMAGES\_MIN\_SIZE Default Value

The default value is:

```json
480
```

## HTTP\_TIMEOUT

Timeout for outgoing HTTP requests in milliseconds

`HTTP_TIMEOUT`

*   is optional

*   Type: `integer`

*   cannot be null

*   defined in: [Secrets](secrets-properties-http_timeout.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/HTTP_TIMEOUT")

### HTTP\_TIMEOUT Type

`integer`

### HTTP\_TIMEOUT Default Value

The default value is:

```json
1000
```

## HTTP\_TIMEOUT\_EXTERNAL

Timeout for outgoing HTTP requests to external services in milliseconds

`HTTP_TIMEOUT_EXTERNAL`

*   is optional

*   Type: `integer`

*   cannot be null

*   defined in: [Secrets](secrets-properties-http_timeout_external.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/HTTP_TIMEOUT_EXTERNAL")

### HTTP\_TIMEOUT\_EXTERNAL Type

`integer`

### HTTP\_TIMEOUT\_EXTERNAL Default Value

The default value is:

```json
20000
```

## TEST\_BOOLEAN



`TEST_BOOLEAN`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [Secrets](secrets-properties-test_boolean.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/TEST_BOOLEAN")

### TEST\_BOOLEAN Type

`boolean`

### TEST\_BOOLEAN Default Value

The default value is:

```json
true
```

## XML\_PRETTY

Print XML with line breaks and indentation

`XML_PRETTY`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [Secrets](secrets-properties-xml_pretty.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/XML_PRETTY")

### XML\_PRETTY Type

`boolean`

### XML\_PRETTY Default Value

The default value is:

```json
true
```

## SANITIZE\_DOM

Sanitize the HTML output to guard against XSS attacks.

**Note:** this flag applies a pretty aggressive DOM filtering that will strip out a lot of HTML that your authors might find useful. The setting is meant for processing truly untrusted inputs, such as comments in a social media site.

`SANITIZE_DOM`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [Secrets](secrets-properties-sanitize_dom.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/SANITIZE_DOM")

### SANITIZE\_DOM Type

`boolean`

## RESOLVE\_GITREF\_SERVICE

API endpoint or action name to the service that resolves github refs to commit SHAs.

`RESOLVE_GITREF_SERVICE`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Secrets](secrets-properties-resolve_gitref_service.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/RESOLVE_GITREF_SERVICE")

### RESOLVE\_GITREF\_SERVICE Type

`string`

## GITHUB\_TOKEN

GitHub access token to use while fetching markdown. See <https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line>.

`GITHUB_TOKEN`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Secrets](secrets-properties-github_token.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/GITHUB_TOKEN")

### GITHUB\_TOKEN Type

`string`

## CONTENT\_PROXY\_URL

URL of the content proxy service.

`CONTENT_PROXY_URL`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Secrets](secrets-properties-content_proxy_url.md "https://ns.adobe.com/helix/pipeline/secrets#/properties/CONTENT_PROXY_URL")

### CONTENT\_PROXY\_URL Type

`string`

### CONTENT\_PROXY\_URL Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")

## Pattern: `[A-Z0-9_]+`



`[A-Z0-9_]+`

*   is optional

*   Type: any of the folllowing: `boolean` or `integer` or `number` or `string` ([Details](secrets-patternproperties-a-z0-9_.md))

*   cannot be null

*   defined in: [Secrets](secrets-patternproperties-a-z0-9_.md "https://ns.adobe.com/helix/pipeline/secrets#/patternProperties/\[A-Z0-9_]+")

### \[A-Z0-9\_]+ Type

any of the folllowing: `boolean` or `integer` or `number` or `string` ([Details](secrets-patternproperties-a-z0-9_.md))
