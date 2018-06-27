const assert = require("assert");

describe("Testing Attacher", () => {
    it("Executes once", done => {
        const pipeline = require("../index.js");

        pipeline().once(() => {
            done();
        })();
    });

    it("Executes pre", done => {
        const pipeline = require("../index.js");
        pipeline().pre(() => {
            done();
        })();
    });

    it("Executes post", done => {
        const pipeline = require("../index.js");
        pipeline().post(() => {
            done();
        })();
    });

    it("Executes promises", done => {
        const pipeline = require("../index.js");
        const retval = pipeline()
            .post(() => {
                return Promise.resolve({ foo: "bar" });
            })
            .post(v => {
                //console.log(v);
                assert.equal(v.foo, "bar");
            })();
        retval.then(r => {
            assert.equal(r.foo, "bar");
            done();
        });
    });
});
