# Content Schema

```txt
https://ns.adobe.com/helix/pipeline/content
```

The `content` object represents the content that is being processed in the pipeline.

With each step of the pipeline, the `content` will be enriched and gain additional properties.

In a typical processing, `content` will start empty, and then gain a [`body`](#body) as the resource is fetched from the content repository.

In the second step, the `body` will be parsed using a Markdown parser, resulting in the populated [`mdast`](#mdast) property, which is a representation of the Markdown.

After that, the Markdown AST is processed furthermore to extract [`sections`](#meta), [`title`](#title), [`intro`](#intro), and [`meta`](#meta).

| Abstract            | Extensible | Status      | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                        |
| :------------------ | :--------- | :---------- | :----------- | :---------------- | :-------------------- | :------------------ | :---------------------------------------------------------------- |
| Can be instantiated | No         | Stabilizing | No           | Forbidden         | Forbidden             | none                | [content.schema.json](content.schema.json "open original schema") |

## Content Type

`object` ([Content](content.md))

# Content Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                   |
| :-------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------- |
| [sources](#sources)   | `array`  | Optional | cannot be null | [Content](content-properties-sources.md "https://ns.adobe.com/helix/pipeline/content#/properties/sources")   |
| [body](#body)         | `string` | Optional | cannot be null | [Content](content-properties-body.md "https://ns.adobe.com/helix/pipeline/content#/properties/body")         |
| [mdast](#mdast)       | `object` | Optional | cannot be null | [Content](content-properties-mdast.md "https://ns.adobe.com/helix/pipeline/mdast#/properties/mdast")         |
| [document](#document) | `object` | Optional | cannot be null | [Content](content-properties-document.md "https://ns.adobe.com/helix/pipeline/content#/properties/document") |
| [json](#json)         | `object` | Optional | cannot be null | [Content](content-properties-json.md "https://ns.adobe.com/helix/pipeline/content#/properties/json")         |
| [xml](#xml)           | `object` | Optional | cannot be null | [Content](content-properties-xml.md "https://ns.adobe.com/helix/pipeline/content#/properties/xml")           |
| [meta](#meta)         | `object` | Optional | can be null    | [Content](meta-definitions-meta.md "https://ns.adobe.com/helix/pipeline/content#/properties/meta")           |
| [title](#title)       | `string` | Optional | cannot be null | [Content](content-properties-title.md "https://ns.adobe.com/helix/pipeline/content#/properties/title")       |
| [intro](#intro)       | `string` | Optional | cannot be null | [Content](content-properties-intro.md "https://ns.adobe.com/helix/pipeline/content#/properties/intro")       |
| [image](#image)       | `string` | Optional | cannot be null | [Content](content-properties-image.md "https://ns.adobe.com/helix/pipeline/content#/properties/image")       |
| [data](#data)         | `object` | Optional | cannot be null | [Content](content-properties-data.md "https://ns.adobe.com/helix/pipeline/content#/properties/data")         |

## sources

List of URIs that have been retrieved for this piece of content

`sources`

*   is optional

*   Type: `string[]`

*   cannot be null

*   defined in: [Content](content-properties-sources.md "https://ns.adobe.com/helix/pipeline/content#/properties/sources")

### sources Type

`string[]`

## body

The content body of the retrieved source document

`body`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Content](content-properties-body.md "https://ns.adobe.com/helix/pipeline/content#/properties/body")

### body Type

`string`

## mdast

A node in the Markdown AST

`mdast`

*   is optional

*   Type: `object` ([MDAST](content-properties-mdast.md))

*   cannot be null

*   defined in: [Content](content-properties-mdast.md "https://ns.adobe.com/helix/pipeline/mdast#/properties/mdast")

### mdast Type

`object` ([MDAST](content-properties-mdast.md))

## document

The DOM-compatible representation of the document's inner HTML

`document`

*   is optional

*   Type: `object` ([Details](content-properties-document.md))

*   cannot be null

*   defined in: [Content](content-properties-document.md "https://ns.adobe.com/helix/pipeline/content#/properties/document")

### document Type

`object` ([Details](content-properties-document.md))

## json

The JSON object to emit.

`json`

*   is optional

*   Type: `object` ([Details](content-properties-json.md))

*   cannot be null

*   defined in: [Content](content-properties-json.md "https://ns.adobe.com/helix/pipeline/content#/properties/json")

### json Type

`object` ([Details](content-properties-json.md))

## xml

The XML object to emit. See xmlbuilder-js for syntax.

`xml`

*   is optional

*   Type: `object` ([Details](content-properties-xml.md))

*   cannot be null

*   defined in: [Content](content-properties-xml.md "https://ns.adobe.com/helix/pipeline/content#/properties/xml")

### xml Type

`object` ([Details](content-properties-xml.md))

## meta



`meta`

*   is optional

*   Type: `object` ([Details](meta-definitions-meta.md))

*   can be null

*   defined in: [Content](meta-definitions-meta.md "https://ns.adobe.com/helix/pipeline/content#/properties/meta")

### meta Type

`object` ([Details](meta-definitions-meta.md))

## title

Extracted title of the document

`title`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Content](content-properties-title.md "https://ns.adobe.com/helix/pipeline/content#/properties/title")

### title Type

`string`

## intro

Extracted first paragraph of the document

`intro`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Content](content-properties-intro.md "https://ns.adobe.com/helix/pipeline/content#/properties/intro")

### intro Type

`string`

## image

Path (can be relative) to the first image in the document

`image`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Content](content-properties-image.md "https://ns.adobe.com/helix/pipeline/content#/properties/image")

### image Type

`string`

### image Constraints

**URI reference**: the string must be a URI reference, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")

## data

Custom object that can hold any user defined data.

`data`

*   is optional

*   Type: `object` ([Details](content-properties-data.md))

*   cannot be null

*   defined in: [Content](content-properties-data.md "https://ns.adobe.com/helix/pipeline/content#/properties/data")

### data Type

`object` ([Details](content-properties-data.md))
