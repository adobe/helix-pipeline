const _ = require("lodash/fp");
const Promise = require("bluebird");

function attacher() {
    const inner = function(args = {}) {
        /*
        // run the functions inside inner.pres first
        const preval = inner.pres.reduce(inner.merge, _.merge({}, args));

        // then run the function inner.once
        const onceval = _.merge(preval, inner.oncef(_.merge({}, preval)));

        // then run each of the functions in inner.posts
        const postval = inner.posts.reduce(inner.posts, _.merge({}, onceval));

        // then return the accumulated value
        return postval;
        */
        const prom = Promise.reduce(
            [...inner.pres, inner.oncef, ...inner.posts],
            inner.merge,
            args
        ).then(v => {
            return v;
        });

        return prom;
    };

    inner.merge = function(accumulator, currentvalue) {
        return Promise.resolve(currentvalue(_.merge({}, accumulator))).then(
            value => _.merge(accumulator, value)
        );
    };

    inner.pre = function(outer) {
        inner.pres.push(outer);
        inner.last = inner.pres;
        return inner;
    };

    inner.post = function(outer) {
        inner.posts.push(outer);
        inner.last = inner.post;
        return inner;
    };

    inner.when = function(pred) {
        if (inner.last && inner.last.length > 0) {
            const lastfunc = inner.last.pop();
            const wrappedfunc = args => {
                if (pred(args)) {
                    return lastfunc(args);
                } else {
                    return args;
                }
            };
            inner.last.push(wrappedfunc);
        }
        return inner;
    };

    inner.unless = function(pred) {
        inner.when(args => {
            return !pred(args);
        });
        return inner;
    };

    inner.last;
    inner.pres = [];
    inner.posts = [];
    inner.oncef = function(args) {
        return args;
    };

    inner.once = function(outer) {
        inner.oncef = outer;
        return inner;
    };

    return inner;
}

module.exports = attacher;
