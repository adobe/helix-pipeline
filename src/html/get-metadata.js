const filter = require("unist-util-filter");
const select = require("unist-util-select");
const plain = require("mdast-util-to-string");
const yaml = require("yaml");


module.exports = function({ resource: { mdast } }) {
    const resource = {};

    const yamls = select(mdast, "yaml"); // select all YAML nodes
    const mapped = yamls.map(({value}) => yaml.eval(value));
    const meta = Object.assign(...mapped);
    resource.meta = meta;

    const headers = select(mdast, "heading");
    if (headers[0]) {
        resource.title = plain(headers[0]);
        resource.intro = plain(headers[0]);
    }

    const paragraphs = select(mdast, "paragraph");
    if (paragraphs[0]) {
        if (!headers[0]) {
            resource.title = plain(paragraphs[0]);
        }
        resource.intro = plain(paragraphs[0]);
    }

    return { resource: resource};
};
