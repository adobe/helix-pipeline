The `content` object represents the content that is being processed in the pipeline.

With each step of the pipeline, the `content` will be enriched and gain additional properties.

In a typical processing, `content` will start empty, and then gain a [`body`](#body) as the resource is fetched from the content repository.

In the second step, the `body` will be parsed using a Markdown parser, resulting in the populated [`mdast`](#mdast) property, which is a representation of the Markdown.

After that, the Markdown AST is processed furthermore to extract [`sections`](#meta), [`title`](#title), [`intro`](#intro), and [`meta`](#meta).