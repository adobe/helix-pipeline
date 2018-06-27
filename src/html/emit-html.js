const tohtml = require('hast-util-to-html')

module.exports = ({resource: {htast}}) => {
    const children = htast.children.map(tohtml);
    return { resource: { html: children.join(''), children: children } };
}