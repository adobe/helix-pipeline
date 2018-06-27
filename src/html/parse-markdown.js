const unified = require('unified');
const remark = require('remark-parse');
const frontmatter = require('remark-frontmatter');

module.exports = function({resource}) {
    const preprocessor = unified()
        .use(remark)
        .use(frontmatter);
    
    const mdast = preprocessor.parse(resource.body);

    return { resource: { mdast: mdast }};
}