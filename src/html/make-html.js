const tohtast = require('mdast-util-to-hast');

module.exports = function({resource: {mdast}}) {
    const resource = {};
    resource.htast = tohtast(mdast);
    return {resource};
}