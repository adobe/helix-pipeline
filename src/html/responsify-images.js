/* eslint-disable no-param-reassign */

module.exports = function attacher(
    RESOLUTION_SWITCHING = [
        {
            width: 480,
            maxWidth: 480,
            size: 95
        },
        {
            width: 799,
            maxWidth: 799,
            size: 95
        },
        {
            width: 1024,
            maxWidth: null,
            size: 97
        }
    ]
) {
    function visit(node) {
        if (node.type === "element" && node.tagName === "img") {
            const src = String(node.properties.src);

            node.properties.src = `${src}?width=320`;

            const srcset = [];
            const sizes = [];

            RESOLUTION_SWITCHING.forEach(e => {
                srcset.push(`${src}?width=${e.width} ${e.width}w`);
                sizes.push(
                    `${(e.maxWidth ? `(max-width: ${e.maxWidth}px) ` : "") +
                        e.size}vw`
                );
            });

            node.properties.srcset = srcset.join(", ");
            node.properties.sizes = sizes.join(", ");
        }

        if (node.children) {
            node.children.forEach(e => {
                visit(e);
            });
        }
    }

    function transformer({ resource: { htast } }) {
        // the visit function is modifying its argument in place.
        console.log("I am here");
        visit(htast);

        return { resource: { htast: htast } };
    }

    return transformer;
};
