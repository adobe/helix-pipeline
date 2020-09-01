# Secrets Schema

```txt
https://ns.adobe.com/helix/pipeline/secrets#/properties/secrets
```

Secrets passed into the pipeline such as API Keys or configuration settings.


| Abstract            | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                        |
| :------------------ | ---------- | ------ | ------------ | :---------------- | --------------------- | ------------------- | ----------------------------------------------------------------- |
| Can be instantiated | No         | Stable | No           | Forbidden         | Forbidden             | none                | [action.schema.json\*](action.schema.json "open original schema") |

## secrets Type

`object` ([Secrets](action-properties-secrets.md))

# Secrets Properties

| Property                                          | Type      | Required | Nullable       | Defined by                                                                                                                                    |
| :------------------------------------------------ | --------- | -------- | -------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| [REPO_RAW_ROOT](#REPO_RAW_ROOT)                   | `string`  | Optional | cannot be null | [Secrets](secrets-properties-repo_raw_root.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/REPO_RAW_ROOT")                   |
| [REPO_API_ROOT](#REPO_API_ROOT)                   | `string`  | Optional | cannot be null | [Secrets](secrets-properties-repo_api_root.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/REPO_API_ROOT")                   |
| [EMBED_ALLOWLIST](#EMBED_ALLOWLIST)               | `string`  | Optional | cannot be null | [Secrets](secrets-properties-embed_allowlist.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/EMBED_ALLOWLIST")               |
| [DATA_EMBED_ALLOWLIST](#DATA_EMBED_ALLOWLIST)     | `string`  | Optional | cannot be null | [Secrets](secrets-properties-data_embed_allowlist.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/DATA_EMBED_ALLOWLIST")     |
| [EMBED_SERVICE](#EMBED_SERVICE)                   | `string`  | Optional | cannot be null | [Secrets](secrets-properties-embed_service.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/EMBED_SERVICE")                   |
| [DATA_EMBED_SERVICE](#DATA_EMBED_SERVICE)         | `string`  | Optional | cannot be null | [Secrets](secrets-properties-data_embed_service.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/DATA_EMBED_SERVICE")         |
| [EMBED_SELECTOR](#EMBED_SELECTOR)                 | `string`  | Optional | cannot be null | [Secrets](secrets-properties-embed_selector.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/EMBED_SELECTOR")                 |
| [IMAGES_MIN_SIZE](#IMAGES_MIN_SIZE)               | `integer` | Optional | cannot be null | [Secrets](secrets-properties-images_min_size.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/IMAGES_MIN_SIZE")               |
| [HTTP_TIMEOUT](#HTTP_TIMEOUT)                     | `integer` | Optional | cannot be null | [Secrets](secrets-properties-http_timeout.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/HTTP_TIMEOUT")                     |
| [HTTP_TIMEOUT_EXTERNAL](#HTTP_TIMEOUT_EXTERNAL)   | `integer` | Optional | cannot be null | [Secrets](secrets-properties-http_timeout_external.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/HTTP_TIMEOUT_EXTERNAL")   |
| [TEST_BOOLEAN](#TEST_BOOLEAN)                     | `boolean` | Optional | cannot be null | [Secrets](secrets-properties-test_boolean.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/TEST_BOOLEAN")                     |
| [XML_PRETTY](#XML_PRETTY)                         | `boolean` | Optional | cannot be null | [Secrets](secrets-properties-xml_pretty.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/XML_PRETTY")                         |
| [SANITIZE_DOM](#SANITIZE_DOM)                     | `boolean` | Optional | cannot be null | [Secrets](secrets-properties-sanitize_dom.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/SANITIZE_DOM")                     |
| [RESOLVE_GITREF_SERVICE](#RESOLVE_GITREF_SERVICE) | `string`  | Optional | cannot be null | [Secrets](secrets-properties-resolve_gitref_service.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/RESOLVE_GITREF_SERVICE") |
| [GITHUB_TOKEN](#GITHUB_TOKEN)                     | `string`  | Optional | cannot be null | [Secrets](secrets-properties-github_token.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/GITHUB_TOKEN")                     |
| [CONTENT_PROXY_URL](#CONTENT_PROXY_URL)           | `string`  | Optional | cannot be null | [Secrets](secrets-properties-content_proxy_url.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/CONTENT_PROXY_URL")           |
| `[A-Z0-9_]+`                                      | Multiple  | Optional | cannot be null | [Secrets](secrets-patternproperties-a-z0-9_.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/patternProperties/\[A-Z0-9\_]+")            |

## REPO_RAW_ROOT

The Base URL for retrieving raw text files from GitHub


`REPO_RAW_ROOT`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Secrets](secrets-properties-repo_raw_root.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/REPO_RAW_ROOT")

### REPO_RAW_ROOT Type

`string`

### REPO_RAW_ROOT Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc4291 "check the specification")

### REPO_RAW_ROOT Default Value

The default value is:

```json
"https://raw.githubusercontent.com/"
```

## REPO_API_ROOT

The base URL for all GitHub API operations


`REPO_API_ROOT`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Secrets](secrets-properties-repo_api_root.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/REPO_API_ROOT")

### REPO_API_ROOT Type

`string`

### REPO_API_ROOT Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc4291 "check the specification")

### REPO_API_ROOT Default Value

The default value is:

```json
"https://api.github.com/"
```

## EMBED_ALLOWLIST

Comma-separated list of allowed hostnames for embeds. Supports `*.example.com` as a subdomain wildcard. Use `*` to allow all embeds (potentially insecure and conflicting with `DATA_EMBED_ALLOWLIST`)


`EMBED_ALLOWLIST`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Secrets](secrets-properties-embed_allowlist.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/EMBED_ALLOWLIST")

### EMBED_ALLOWLIST Type

`string`

### EMBED_ALLOWLIST Default Value

The default value is:

```json
"www.youtube.com, spark.adobe.com, unsplash.com, soundcloud.com, lottiefiles.com, www.slideshare.net, vimeo.com, www.instagram.com, twitter.com, open.spotify.com, web.spotify.com, player.vimeo.com, www.linkedin.com, w.soundcloud.com, www.slideshare.net, youtu.be, media.giphy.com, video.tv.adobe.com, api.soundcloud.com, xd.adobe.com"
```

## DATA_EMBED_ALLOWLIST

Comma-separated list of allowed hostnames for data embeds. Supports `*.example.com` as a subdomain wildcard. Use `*` to allow all embeds (potentially insecure and conflicting with `EMBED_ALLOWLIST`)


`DATA_EMBED_ALLOWLIST`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Secrets](secrets-properties-data_embed_allowlist.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/DATA_EMBED_ALLOWLIST")

### DATA_EMBED_ALLOWLIST Type

`string`

### DATA_EMBED_ALLOWLIST Default Value

The default value is:

```json
"docs.google.com, *.sharepoint.com"
```

## EMBED_SERVICE

URL of an Embed Service that takes the appended URL and returns an embeddable HTML representation.


`EMBED_SERVICE`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Secrets](secrets-properties-embed_service.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/EMBED_SERVICE")

### EMBED_SERVICE Type

`string`

### EMBED_SERVICE Default Value

The default value is:

```json
"https://adobeioruntime.net/api/v1/web/helix/helix-services/embed@v1"
```

## DATA_EMBED_SERVICE

URL of a DataEmbed Service that takes the appended URL and returns an iterable JSON representation.


`DATA_EMBED_SERVICE`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Secrets](secrets-properties-data_embed_service.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/DATA_EMBED_SERVICE")

### DATA_EMBED_SERVICE Type

`string`

### DATA_EMBED_SERVICE Default Value

The default value is:

```json
"https://adobeioruntime.net/api/v1/web/helix/helix-services/data-embed@v1"
```

## EMBED_SELECTOR

Selector to be used when resolving internal embeds.


`EMBED_SELECTOR`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Secrets](secrets-properties-embed_selector.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/EMBED_SELECTOR")

### EMBED_SELECTOR Type

`string`

### EMBED_SELECTOR Default Value

The default value is:

```json
"embed"
```

## IMAGES_MIN_SIZE

Minimum physical width of responsive images to generate


`IMAGES_MIN_SIZE`

-   is optional
-   Type: `integer`
-   cannot be null
-   defined in: [Secrets](secrets-properties-images_min_size.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/IMAGES_MIN_SIZE")

### IMAGES_MIN_SIZE Type

`integer`

### IMAGES_MIN_SIZE Default Value

The default value is:

```json
480
```

## HTTP_TIMEOUT

Timeout for outgoing HTTP requests in milliseconds


`HTTP_TIMEOUT`

-   is optional
-   Type: `integer`
-   cannot be null
-   defined in: [Secrets](secrets-properties-http_timeout.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/HTTP_TIMEOUT")

### HTTP_TIMEOUT Type

`integer`

### HTTP_TIMEOUT Default Value

The default value is:

```json
1000
```

## HTTP_TIMEOUT_EXTERNAL

Timeout for outgoing HTTP requests to external services in milliseconds


`HTTP_TIMEOUT_EXTERNAL`

-   is optional
-   Type: `integer`
-   cannot be null
-   defined in: [Secrets](secrets-properties-http_timeout_external.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/HTTP_TIMEOUT_EXTERNAL")

### HTTP_TIMEOUT_EXTERNAL Type

`integer`

### HTTP_TIMEOUT_EXTERNAL Default Value

The default value is:

```json
20000
```

## TEST_BOOLEAN




`TEST_BOOLEAN`

-   is optional
-   Type: `boolean`
-   cannot be null
-   defined in: [Secrets](secrets-properties-test_boolean.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/TEST_BOOLEAN")

### TEST_BOOLEAN Type

`boolean`

### TEST_BOOLEAN Default Value

The default value is:

```json
true
```

## XML_PRETTY

Print XML with line breaks and indentation


`XML_PRETTY`

-   is optional
-   Type: `boolean`
-   cannot be null
-   defined in: [Secrets](secrets-properties-xml_pretty.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/XML_PRETTY")

### XML_PRETTY Type

`boolean`

### XML_PRETTY Default Value

The default value is:

```json
true
```

## SANITIZE_DOM

Sanitize the HTML output to guard against XSS attacks. 

**Note:** this flag applies a pretty aggressive DOM filtering that will strip out a lot of HTML that your authors might find useful. The setting is meant for processing truly untrusted inputs, such as comments in a social media site.


`SANITIZE_DOM`

-   is optional
-   Type: `boolean`
-   cannot be null
-   defined in: [Secrets](secrets-properties-sanitize_dom.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/SANITIZE_DOM")

### SANITIZE_DOM Type

`boolean`

## RESOLVE_GITREF_SERVICE

API endpoint or action name to the service that resolves github refs to commit SHAs.


`RESOLVE_GITREF_SERVICE`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Secrets](secrets-properties-resolve_gitref_service.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/RESOLVE_GITREF_SERVICE")

### RESOLVE_GITREF_SERVICE Type

`string`

## GITHUB_TOKEN

GitHub access token to use while fetching markdown. See <https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line>.


`GITHUB_TOKEN`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Secrets](secrets-properties-github_token.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/GITHUB_TOKEN")

### GITHUB_TOKEN Type

`string`

## CONTENT_PROXY_URL

URL of the content proxy service.


`CONTENT_PROXY_URL`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Secrets](secrets-properties-content_proxy_url.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/properties/CONTENT_PROXY_URL")

### CONTENT_PROXY_URL Type

`string`

### CONTENT_PROXY_URL Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc4291 "check the specification")

## Pattern: `[A-Z0-9_]+`




`[A-Z0-9_]+`

-   is optional
-   Type: any of the folllowing: `boolean` or `integer` or `number` or `string` ([Details](secrets-patternproperties-a-z0-9_.md))
-   cannot be null
-   defined in: [Secrets](secrets-patternproperties-a-z0-9_.md "https&#x3A;//ns.adobe.com/helix/pipeline/secrets#/patternProperties/\[A-Z0-9\_]+")

### \[A-Z0-9\_]+ Type

any of the folllowing: `boolean` or `integer` or `number` or `string` ([Details](secrets-patternproperties-a-z0-9_.md))
