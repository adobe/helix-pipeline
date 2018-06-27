// default processing pipeline for HTML
const pipeline = require("../../index.js");
const { before, after, log } = require('./default.js');

module.exports.pipe = function(cont, params, secrets, logger = log) {
    logger.log("debug", "Constructing HTML Pipeline");
    const pipe = pipeline()
        .pre(before)
        .pre(require("../html/fetch-markdown.js")(secrets))
        .pre(require("../html/parse-markdown.js"))
        .pre(require("../html/get-metadata.js"))
        .pre(require("../html/make-html.js"))
        // we could pass different resolutions here.
        .pre(require("../html/responsify-images.js")())
        .pre(require("../html/emit-html.js"))
        .once(cont)
        .post(require("../html/set-content-type.js"))
        .post(after);

    return pipe;
};
