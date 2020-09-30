# README

## Top-level Schemas

-   [Action](./action.md "Tracks the OpenWhisk action invocation") – `https://ns.adobe.com/helix/pipeline/action`
-   [Content](./content.md "The content as retrieved from the repository and enriched in the pipeline") – `https://ns.adobe.com/helix/pipeline/content`
-   [Context](./context.md "The context thingie") – `https://ns.adobe.com/helix/pipeline/context`
-   [MDAST](./mdast.md "A node in the Markdown AST") – `https://ns.adobe.com/helix/pipeline/mdast`
-   [Meta](./meta.md "Content and Section Metadata Properties") – `https://ns.adobe.com/helix/pipeline/meta`
-   [Position](./position.md "Marks the position of an AST node in the original text flow") – `https://ns.adobe.com/helix/pipeline/position`
-   [Raw Request](./rawrequest.md "The Request Object used for Invoking OpenWhisk") – `https://ns.adobe.com/helix/pipeline/rawrequest`
-   [Request](./request.md "The HTTP Request") – `https://ns.adobe.com/helix/pipeline/request`
-   [Response](./response.md "The HTTP response object") – `https://ns.adobe.com/helix/pipeline/response`
-   [Secrets](./secrets.md "Secrets passed into the pipeline such as API Keys or configuration settings") – `https://ns.adobe.com/helix/pipeline/secrets`
-   [Section](./section.md "A section in a markdown document") – `https://ns.adobe.com/helix/pipeline/section`
-   [Text Coordinates](./textcoordinates.md "A position in a text document") – `https://ns.adobe.com/helix/pipeline/textcoordinates`

## Other Schemas

### Objects

-   [MDAST](./content-properties-mdast.md "A node in the Markdown AST") – `https://ns.adobe.com/helix/pipeline/mdast#/properties/mdast`
-   [Position](./section-definitions-section-properties-position.md "Marks the position of an AST node in the original text flow") – `https://ns.adobe.com/helix/pipeline/position#/definitions/section/properties/position`
-   [Raw Request](./action-properties-raw-request.md "The Request Object used for Invoking OpenWhisk") – `https://ns.adobe.com/helix/pipeline/rawrequest#/properties/request`
-   [Request](./context-properties-request.md "The HTTP Request") – `https://ns.adobe.com/helix/pipeline/request#/properties/request`
-   [Response](./context-properties-response.md "The HTTP response object") – `https://ns.adobe.com/helix/pipeline/response#/properties/response`
-   [Secrets](./action-properties-secrets.md "Secrets passed into the pipeline such as API Keys or configuration settings") – `https://ns.adobe.com/helix/pipeline/secrets#/properties/secrets`
-   [Text Coordinates](./position-properties-text-coordinates.md "A position in a text document") – `https://ns.adobe.com/helix/pipeline/textcoordinates#/properties/start`
-   [Untitled object in Action](./action-properties-downloader.md "A Downloader instance") – `https://ns.adobe.com/helix/pipeline/action#/properties/downloader`
-   [Untitled object in Action](./action-properties-versionlock.md "A VersionLock instance") – `https://ns.adobe.com/helix/pipeline/action#/properties/versionLock`
-   [Untitled object in Action](./action-properties-markupconfig.md "A markup configuration") – `https://ns.adobe.com/helix/pipeline/action#/properties/markupconfig`
-   [Untitled object in Action](./action-properties-debug.md "Internal information related to debugging") – `https://ns.adobe.com/helix/pipeline/action#/properties/debug`
-   [Untitled object in Action](./action-properties-logger.md "A helix-log SimpleInterface logger instance") – `https://ns.adobe.com/helix/pipeline/action#/properties/logger`
-   [Untitled object in Action](./action-properties-transformer.md "A VDOMTransformer instance") – `https://ns.adobe.com/helix/pipeline/action#/properties/transformer`
-   [Untitled object in Content](./content-properties-xml.md "The XML object to emit") – `https://ns.adobe.com/helix/pipeline/content#/properties/xml`
-   [Untitled object in Content](./content-properties-json.md "The JSON object to emit") – `https://ns.adobe.com/helix/pipeline/content#/properties/json`
-   [Untitled object in Content](./content-properties-document.md "The DOM-compatible representation of the document's inner HTML") – `https://ns.adobe.com/helix/pipeline/content#/properties/document`
-   [Untitled object in Content](./content-properties-data.md "Custom object that can hold any user defined data") – `https://ns.adobe.com/helix/pipeline/content#/properties/data`
-   [Untitled object in MDAST](./mdast-properties-payload.md "The payload of a frontmatter/yaml block") – `https://ns.adobe.com/helix/pipeline/mdast#/properties/payload`
-   [Untitled object in MDAST](./mdast-properties-payload.md "The payload of a frontmatter/yaml block") – `https://ns.adobe.com/helix/pipeline/mdast#/properties/payload`
-   [Untitled object in MDAST](./mdast-properties-data-hproperties-items.md) – `https://ns.adobe.com/helix/pipeline/mdast#/properties/data/hProperties/items`
-   [Untitled object in MDAST](./mdast-properties-data-hchildren-items.md) – `https://ns.adobe.com/helix/pipeline/mdast#/properties/data/hChildren/items`
-   [Untitled object in MDAST](./mdast-properties-data-hchildren-items.md) – `https://ns.adobe.com/helix/pipeline/mdast#/properties/data/hChildren/items`
-   [Untitled object in MDAST](./mdast-properties-data-hproperties-items.md) – `https://ns.adobe.com/helix/pipeline/mdast#/properties/data/hProperties/items`
-   [Untitled object in MDAST](./mdast-properties-data.md "data is guaranteed to never be specified by unist or specifications implementing unist") – `https://ns.adobe.com/helix/pipeline/mdast#/properties/data`
-   [Untitled object in MDAST](./mdast-properties-data.md "data is guaranteed to never be specified by unist or specifications implementing unist") – `https://ns.adobe.com/helix/pipeline/mdast#/properties/data`
-   [Untitled object in Raw Request](./rawrequest-definitions-rawrequest-properties-headers.md "The headers of the request made to OpenWhisk (or Simulator)") – `https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/headers`
-   [Untitled object in Raw Request](./rawrequest-definitions-rawrequest-properties-params-properties-__ow_headers.md "Deprecated: The original OpenWhisk request headers") – `https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/__ow_headers`
-   [Untitled object in Raw Request](./rawrequest-definitions-rawrequest-properties-params.md "Parameters used to invoke the OpenWhisk action") – `https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params`
-   [Untitled object in Raw Request](./rawrequest-definitions-rawrequest-properties-params-properties-__ow_headers.md "Deprecated: The original OpenWhisk request headers") – `https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/__ow_headers`
-   [Untitled object in Raw Request](./rawrequest-definitions-rawrequest-properties-params.md "Parameters used to invoke the OpenWhisk action") – `https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params`
-   [Untitled object in Raw Request](./rawrequest-definitions-rawrequest-properties-headers.md "The headers of the request made to OpenWhisk (or Simulator)") – `https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/headers`
-   [Untitled object in Raw Request](./rawrequest-definitions-rawrequest-properties-params.md "Parameters used to invoke the OpenWhisk action") – `https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params`
-   [Untitled object in Raw Request](./rawrequest-definitions-rawrequest-properties-params-properties-__ow_headers.md "Deprecated: The original OpenWhisk request headers") – `https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/__ow_headers`
-   [Untitled object in Raw Request](./rawrequest-definitions-rawrequest-properties-headers.md "The headers of the request made to OpenWhisk (or Simulator)") – `https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/headers`
-   [Untitled object in Raw Request](./rawrequest-definitions-rawrequest-properties-headers.md "The headers of the request made to OpenWhisk (or Simulator)") – `https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/headers`
-   [Untitled object in Raw Request](./rawrequest-definitions-rawrequest-properties-params.md "Parameters used to invoke the OpenWhisk action") – `https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params`
-   [Untitled object in Raw Request](./rawrequest-definitions-rawrequest-properties-params-properties-__ow_headers.md "Deprecated: The original OpenWhisk request headers") – `https://ns.adobe.com/helix/pipeline/rawrequest#/definitions/rawrequest/properties/params/properties/__ow_headers`
-   [Untitled object in Request](./request-properties-params.md "The passed through (and filtered) URL parameters of the request") – `https://ns.adobe.com/helix/pipeline/request#/properties/params`
-   [Untitled object in Request](./request-properties-params.md "The passed through (and filtered) URL parameters of the request") – `https://ns.adobe.com/helix/pipeline/request#/properties/params`
-   [Untitled object in Response](./response-properties-document.md "The DOM-compatible representation of the response document") – `https://ns.adobe.com/helix/pipeline/response#/properties/document`
-   [Untitled object in Response](./response-properties-body-anyof-1.md "The JSON object to represent the body of the response") – `https://ns.adobe.com/helix/pipeline/response#/properties/body/anyOf/1`
-   [Untitled object in Response](./response-properties-body-anyof-1.md "The JSON object to represent the body of the response") – `https://ns.adobe.com/helix/pipeline/response#/properties/body/anyOf/1`
-   [Untitled object in Response](./response-properties-document.md "The DOM-compatible representation of the response document") – `https://ns.adobe.com/helix/pipeline/response#/properties/document`

### Arrays

-   [Untitled array in Content](./content-properties-sources.md "List of URIs that have been retrieved for this piece of content") – `https://ns.adobe.com/helix/pipeline/content#/properties/sources`
-   [Untitled array in MDAST](./mdast-properties-children.md) – `https://ns.adobe.com/helix/pipeline/mdast#/properties/children`
-   [Untitled array in MDAST](./mdast-properties-types.md "The inferred class names for the section") – `https://ns.adobe.com/helix/pipeline/mdast#/properties/types`
-   [Untitled array in MDAST](./mdast-properties-align.md "For tables, an align field can be present") – `https://ns.adobe.com/helix/pipeline/mdast#/properties/align`
-   [Untitled array in MDAST](./mdast-properties-children.md) – `https://ns.adobe.com/helix/pipeline/mdast#/properties/children`
-   [Untitled array in MDAST](./mdast-properties-align.md "For tables, an align field can be present") – `https://ns.adobe.com/helix/pipeline/mdast#/properties/align`
-   [Untitled array in MDAST](./mdast-properties-types.md "The inferred class names for the section") – `https://ns.adobe.com/helix/pipeline/mdast#/properties/types`
-   [Untitled array in Meta](./meta-definitions-meta-properties-types.md "The inferred class names for the section") – `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/types`
-   [Untitled array in Meta](./meta-definitions-meta-properties-types.md "The inferred class names for the section") – `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/types`
-   [Untitled array in Meta](./meta-definitions-meta-properties-types.md "The inferred class names for the section") – `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/types`
-   [Untitled array in Meta](./meta-definitions-meta-properties-types.md "The inferred class names for the section") – `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/types`
-   [Untitled array in Meta](./meta-definitions-meta-properties-types.md "The inferred class names for the section") – `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/types`
-   [Untitled array in Meta](./meta-definitions-meta-properties-types.md "The inferred class names for the section") – `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/types`
-   [Untitled array in Meta](./meta-definitions-meta-properties-types.md "The inferred class names for the section") – `https://ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/types`
-   [Untitled array in Position](./position-properties-indent.md) – `https://ns.adobe.com/helix/pipeline/position#/properties/indent`
-   [Untitled array in Position](./position-properties-indent.md) – `https://ns.adobe.com/helix/pipeline/position#/properties/indent`
-   [Untitled array in Request](./request-properties-params-additionalproperties-anyof-1.md) – `https://ns.adobe.com/helix/pipeline/request#/properties/params/additionalProperties/anyOf/1`
-   [Untitled array in Request](./request-properties-params-additionalproperties-anyof-1.md) – `https://ns.adobe.com/helix/pipeline/request#/properties/params/additionalProperties/anyOf/1`
-   [Untitled array in Section](./section-definitions-section-properties-children.md "The AST nodes making up the section") – `https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/children`
-   [Untitled array in Section](./section-definitions-section-properties-children.md "The AST nodes making up the section") – `https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/children`
-   [Untitled array in Section](./section-definitions-section-properties-children.md "The AST nodes making up the section") – `https://ns.adobe.com/helix/pipeline/section#/definitions/section/properties/children`

## Version Note

The schemas linked above follow the JSON Schema Spec version: `http://json-schema.org/draft-07/schema#`
