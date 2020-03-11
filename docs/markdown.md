# Markdown Features in Project Helix

Project Helix uses [GitHub Flavored Markdown](https://github.github.com/gfm/) (GFM) with following extensions:

## Sections

Use the section marker `---` followed and preceeded by a blank line to create a section break. This is a change from GFM, where `---` denotes a [thematic break](https://github.github.com/gfm/#thematic-breaks).

```markdown

This is one section.

---

This is another section.

---

And this is a third section.

```

You can still create thematic breaks in Markdown by using any of the alternative syntaxes:

> A line consisting of 0-3 spaces of indentation, followed by a sequence of three or more matching `_` or `*` characters, each followed optionally by any number of spaces or tabs, forms a thematic break.

## Section Metadata (or Midmatter)

GitHub allows (although not part of the GFM spec) adding metadata to a document by adding a YAML block, enclosed by pairs of `---` to the beginning of the document. This is known as Markdown frontmatter.

```markdown
---
key:value
---

This is my document.
```

Helix extends this notion by allowing to create YAML blocks at the beginning of a section.

```markdown

This is one section.

---
key:value
---

This is another section. It has some meta data.

---

And this is a third section.

```

Because it looks like Markdown "frontmatter", but is allowed in the middle of the document, we call it "midmatter".

## External Embeds

Embedding external content in a Markdown document is supported in Helix Markdown. We support a number of embedding syntaxes that were originally introduced for other software and allow a certain degree of interoperability:

**Note: Helix Pipeline will only process embeds if the URL matches a known whitelist. This is for reasons of security and to guard against accidential embeds.**


### IA Writer-Style Embeds

The [IA Writer Markdown editing app](https://ia.net/writer) for desktop and mobile operating systems [introduced a system called content blocks](https://ia.net/writer/support/general/content-blocks) and this embed style is inspired by the system.

An embed is:

- a whitelisted URL
- in a separate paragraph
- that's all.

```markdown

https://www.youtube.com/watch?v=KOxbO0EI4MA

```

IA Writer-Style Embeds are the simplest and recommended way of creating embeds.

### Gatsby-Style Embeds

This embed style is also supported by a number of Gatsby-plugins like [gatsby-remark-embed-video](https://github.com/borgfriend/gatsby-remark-embed-video). The implementation in Helix shares no code with these plugins.

An embed is:

- an inline code block
- in a separate paragraph
- containing a keyword, a colon `:`, and a whitelisted URL

```markdown

`video: https://www.youtube.com/embed/2Xc9gXyf2G4`

```

In the example above, the keyword is `video`, but any keyword like `embed`, `external`, `link`, `media` is allowed.

### Image-Style Embeds

The only notion Markdown has of external content embedded in the document are images. This embed syntax extends that idea by allowing embeds using the image synatx.

An embed is:

- an image `![]()`
- with a whitelisted URL
- in a separate paragraph

```markdown

![](https://www.youtube.com/watch?v=KOxbO0EI4MA)

```

### Link + Image-Style Embeds

The downside of the three embed approaches above is that they do not work on GitHub and don't have a preview. This is solved by Link + Image-Style embeds, albeit at the cost of a more convoluted syntax.

An embed is:

- a link to a whitelisted URL
- in a separate paragraph
- with a preview image as the only child

```markdown

[![Audi R8](http://img.youtube.com/vi/KOxbO0EI4MA/0.jpg)](https://www.youtube.com/watch?v=KOxbO0EI4MA "Audi R8")

```

## Internal Embeds

Helix also supports internal embeds, similar to [IA Writer's content blocks](https://ia.net/writer/support/general/content-blocks), with following changes:

- any of the external embed syntaxes are supported, not just IA-Writer-Style embeds
- whitelisted URLs must be relative and end with `.md` or `.html`

## Data Embeds and Markdown Templates

Helix also supports the embedding of tabular or list data. This is useful for embedding data from external sources such as:

- Google Sheets (not yet supported)
- Microsoft Excel Online (not yet supported)
- Google Calendar (not yet supported)
- RSS Feeds (not yet supported)

Instead of just dumping the data as a Markdown table, Helix will fetch the data, and find placeholders in the current Markdown document (or section, if the document has sections) and fill the placeholders with the data from the data source.

If the data source has more than one entry, e.g. multiple rows in a spreadsheet, multiple events in a calendar, or multiple posts in an RSS feed, then the content of the document (or section) will be replicated for each entry.

Helix maintains a separate whitelist of URLs that indicate embeddable data sources, so any of the embed synaxes describe above can be used. In the following examples, we will use the IA Writer-style syntax.

### Example

Consider a fictional list of used cars, maintained in a spreadsheet:

| Make    | Model  | Year | Image       | Mileage (from) | Mileage (to) |
| ------- | ------ | ---- | ----------- | -------------- | ------------ |
| Nissan  | Sunny  | 1992 | nissan.jpg  | 100000         | 150000       |
| Renault | Scenic | 2000 | renault.jpg | 75000          | 100000       |
| Honda   | FR-V   | 2005 | honda.png   | 50000          | 150000       |

This list would be represented as a JSON document like this:

```json
[
  {
    "make": "Nissan",
    "model": "Sunny",
    "year": 1992,
    "image": "nissan.jpg",
    "mileage": {
      "from": 100000,
      "to": 150000
    }
  },
  {
    "make": "Renault",
    "model": "Scenic",
    "year": 2000,
    "image": "renault.jpg",
    "mileage": {
      "from": 75000,
      "to": 100000
    }
  },
  {
    "make": "Honda",
    "model": "FR-V",
    "year": 2005,
    "image": "honda.png",
    "mileage": {
      "from": 50000,
      "to": 150000
    }
  }
]
```

The following examples use the above data.

#### Placeholders

To create a data embed, add an embedable URL to the document and use placeholders like `{{make}}` or `{{model}}` in the document.

```markdown


https://docs.google.com/spreadsheets/d/e/2PACX-1vQ78BeYUV4gFee4bSxjN8u86aV853LGYZlwv1jAUMZFnPn5TnIZteDJwjGr2GNu--zgnpTY1E_KHXcF/pubhtml

1. My car: [![{{make}} {{model}}]({{image}})](cars-{{year}}.md)

```

This will create following HTML (boilerplate omitted):

```html
<ol>
  <li>My car:<a href="cars-1992.html"><img src="nissan.jpg" alt="Nissan Sunny"></a></li>
  <li>My car:<a href="cars-2000.html"><img src="renault.jpg" alt="Renault Scenic"></a></li>
  <li>My car:<a href="cars-2005.html"><img src="honda.png" alt="Honda FR-V"></a></li>
</ol>
```

Each of the placeholders have been replaced with entries from the table above.

#### Dot Notation

If you want to address nested properties (this will only be useful for some data sources), use a dot notation like `{{mileage.from}}`:

```markdown

https://docs.google.com/spreadsheets/d/e/2PACX-1vQ78BeYUV4gFee4bSxjN8u86aV853LGYZlwv1jAUMZFnPn5TnIZteDJwjGr2GNu--zgnpTY1E_KHXcF/pubhtml

# My {{make}} {{model}}

![{{make}} {{model}}]({{image}})

Built in {{year}}. Driven from {{mileage.from}} km to {{mileage.to}} km.
```

to generate following HTML:

```html
<h1 id="my-nissan-sunny">My Nissan Sunny</h1>
<p><img src="nissan.jpg" alt="Nissan Sunny"></p>
<p>Built in 1992. Driven from 100000 km to 150000 km.</p>

<h1 id="my-renault-scenic">My Renault Scenic</h1>
<p><img src="renault.jpg" alt="Renault Scenic"></p>
<p>Built in 2000. Driven from 75000 km to 100000 km.</p>

<h1 id="my-honda-fr-v">My Honda FR-V</h1>
<p><img src="honda.png" alt="Honda FR-V"></p>
<p>Built in 2005. Driven from 50000 km to 150000 km.</p>
```

#### Sections

If you have content that you don't want to see repeated for each data element, break it out in separate sections like this:

```markdown

## My Cars

---

https://docs.google.com/spreadsheets/d/e/2PACX-1vQ78BeYUV4gFee4bSxjN8u86aV853LGYZlwv1jAUMZFnPn5TnIZteDJwjGr2GNu--zgnpTY1E_KHXcF/pubhtml

- [![{{make}} {{model}}]({{image}})](cars-{{year}}.md)

```

The first section, containing the "My Cars" headline won't be repeated in the generated HTML:

```html
<div>
  <h2 id="my-cars">My Cars</h2>
</div>
<div>
  <ul>
    <li><a href="cars-1992.html"><img src="nissan.jpg" alt="Nissan Sunny"></a></li>
    <li><a href="cars-2000.html"><img src="renault.jpg" alt="Renault Scenic"></a></li>
    <li><a href="cars-2005.html"><img src="honda.png" alt="Honda FR-V"></a></li>
  </ul>
</div>
```

# Notes for Developers

The new node types are documented in the [MDAST schema documentation](mdast.md). The types mentioned in this document are:

- `section`
- `embed`
- `dataEmbed`

