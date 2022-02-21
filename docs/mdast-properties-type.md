# Untitled undefined type in MDAST Schema

```txt
https://ns.adobe.com/helix/pipeline/mdast#/properties/type
```

The node type of the MDAST node

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                      |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [mdast.schema.json\*](mdast.schema.json "open original schema") |

## type Type

unknown

## type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value                  | Explanation                                                                                                                                                          |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"root"`               | The root node, representing a document or section                                                                                                                    |
| `"paragraph"`          | A paragraph. Note: standalone \`image\` blocks are often wrapped in a \`paragraph\`                                                                                  |
| `"text"`               | Plain text                                                                                                                                                           |
| `"heading"`            | A heading with heading level                                                                                                                                         |
| `"thematicBreak"`      | A section break                                                                                                                                                      |
| `"blockquote"`         | A blockquote                                                                                                                                                         |
| `"list"`               | An ordered or unordered list                                                                                                                                         |
| `"listItem"`           |                                                                                                                                                                      |
| `"table"`              | A table                                                                                                                                                              |
| `"tableRow"`           | A row in a table                                                                                                                                                     |
| `"tableCell"`          | A cell in a table                                                                                                                                                    |
| `"html"`               | Raw HTML embedded in Markdown. Disabled by default.                                                                                                                  |
| `"code"`               | A code block                                                                                                                                                         |
| `"yaml"`               | A metadata block. If the block is not at the top of the document, it will start a new section.                                                                       |
| `"definition"`         | A definition that can be referenced                                                                                                                                  |
| `"footnoteDefinition"` | A footnote                                                                                                                                                           |
| `"emphasis"`           | emphasis (often in italics)                                                                                                                                          |
| `"strong"`             | strong (often in bold type)                                                                                                                                          |
| `"delete"`             | deleted content                                                                                                                                                      |
| `"inlineCode"`         | inline code                                                                                                                                                          |
| `"break"`              | A line break                                                                                                                                                         |
| `"link"`               | A hyperlink                                                                                                                                                          |
| `"image"`              | An image                                                                                                                                                             |
| `"linkReference"`      | A pointer to a link                                                                                                                                                  |
| `"imageReference"`     | A pointer to an image                                                                                                                                                |
| `"footnote"`           | A footnote                                                                                                                                                           |
| `"footnoteReference"`  | A reference to a footnote                                                                                                                                            |
| `"embed"`              | Content embedded from another page, identified by the \`url\` attribute.                                                                                             |
| `"dataEmbed"`          | Data embedded from another data source (API), identified by the \`url\` attribute.                                                                                   |
| `"section"`            | A section within the document. Sections serve as a high-level structure of a single markdown document and can have their own section-specific front matter metadata. |
| `"icon"`               | An SVG icon, identified by the syntax \`:foo:\`                                                                                                                      |
