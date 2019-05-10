Automatic Headings Identifier Generation
========================================

|||
|-|-
|Status  | :green_book:`ACCEPTED`
|Issue   | [#26], [#253]

> TL;DR: a short Y-statement summarizing the decision

In the context of generating heading identifiers for easier URL targeting,
facing the concern that some of them could end up clobbering the DOM
we decided to sanitize the offending identifiers
to achieve proper protection of the DOM,
accepting that in limited use cases where the autor would need to expose a heading that clobbers, that heading would just not get an identifier.

Context
-------

> Describe the detailed context and problem being addressed
Automatic heading identifier generation is extremely useful for authors so they can properly share targeted links to the content in their pages.

Unfortunately, HTML element identifiers are usually exposed on the DOM `document` element for legacy reasons. In some edge cases, the identifier can then end up colliding with existing DOM properties (i.e. `name`, `children`, `location`, etc.) Most modern browsers will protect the DOM API and set these properties as read-only, but some browsers are known to let the properties being overridden. This can become an attack vector for XSS attacks.

Decision
--------

In order to avoid DOM clobbering and reduce the possibility of an XSS attack through that vector, the decision is being made to sanitize the offending heading identifiers by just not exposing them in the DOM. The DOMPurify library that is used to sanitize the whole DOM will automatically remove all `id` properties on the headings that would cause a collision on the DOM properties.

Consequences
------------

All headings will have an automatically generated identifier in the DOM, except those that would clobber the DOM.
The latter will just be output without the `id` attribute.

If the author still needs a proper identifier being exposed in the DOM for easier navigation (which would be the case on API documentation pages), the proposed solutions are:
- Adding a prefix to the heading (i.e. `Event: OnClick`, `Property: Name`)
- Use a custom matcher function that injects a prefix in the identifier in the HTML (i.e. `<h3 id="event-onclick">OnClick</h3>`, `<h3 id="property-name">Name</h3>`)
- Use a custom JavaScript function that generates missing identifiers on headings clientside