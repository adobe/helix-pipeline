/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-env mocha */
const assert = require('assert');
const winston = require('winston');
const { Pipeline } = require('../index.js');

const logger = winston.createLogger({
  // tune this for debugging
  level: 'silly',
  // and turn this on if you want the output
  silent: true,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ],
});

describe('Testing Pipeline', () => {
  it('Executes without logger', (done) => {
    new Pipeline().run().then(() => done()).catch(done);
  });

  it('Executes correct order', (done) => {
    const order = [];
    new Pipeline({ logger })
      .before(() => { order.push('pre0'); })
      .after(() => { order.push('post0'); })
      .before(() => { order.push('pre1'); })
      .after(() => { order.push('post1'); })
      .once(() => { order.push('once'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('Logs correct names', (done) => {
    const order = [];

    const pre0 = () => { order.push('pre0'); };
    const post0 = function post0() {
      order.push('post0');
    };

    function noOp() {}

    let counter = 0;

    const validatinglogger = {
      error: noOp,
      warn: noOp,
      info: noOp,
      verbose: noOp,
      debug: noOp,
      log: noOp,
      silly(msg, obj) {
        counter += 1;
        if (counter === 1) {
          assert.ok(obj.function.match(/^before:pre0/));
        }
        if (counter === 2) {
          assert.ok(obj.function.match(/^before:pre0/));
        }
        if (counter === 3) {
          assert.ok(obj.function.match(/^once:anonymous/));
        }
        if (counter === 4) {
          assert.ok(obj.function.match(/^once:anonymous/));
        }
        if (counter === 5) {
          assert.ok(obj.function.match(/^after:post0/));
        }
        if (counter === 6) {
          assert.ok(obj.function.match(/^after:post0/));
        }
      },
    };

    new Pipeline({ logger: validatinglogger })
      .before(pre0)
      .after(post0)
      .once(() => { order.push('once'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'once', 'post0']);
        done();
      })
      .catch(done);
  });

  it('Disables pre before when', (done) => {
    const order = [];
    new Pipeline({ logger })
      .before(() => { order.push('pre0'); })
      .before(() => { order.push('disabled'); })
      .when(() => false)
      .before(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .after(() => { order.push('post0'); })
      .after(() => { order.push('post1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('Disables pre before when conditionally', (done) => {
    const order = [];
    new Pipeline({ logger })
      .before(() => { order.push('pre0'); })
      .before(() => { order.push('enabled'); })
      .when(() => true)
      .before(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .after(() => { order.push('post0'); })
      .after(() => { order.push('post1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'enabled', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('When works with promises pre before when', (done) => {
    const order = [];
    new Pipeline({ logger })
      .before(() => { order.push('pre0'); })
      .before(() => { order.push('disabled'); })
      .when(() => Promise.resolve(false))
      .before(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .after(() => { order.push('post0'); })
      .after(() => { order.push('post1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('Disables post before when', (done) => {
    const order = [];
    new Pipeline({ logger })
      .before(() => { order.push('pre0'); })
      .before(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .after(() => { order.push('post0'); })
      .after(() => { order.push('disabled'); })
      .when(() => false)
      .after(() => { order.push('post1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('when after once throws error', (done) => {
    try {
      const order = [];
      new Pipeline({ logger })
        .before(() => { order.push('pre0'); })
        .once(() => { order.push('once'); })
        .when(() => false)
        .after(() => { order.push('post1'); })
        .run()
        .then(() => {
          assert.fail('when after once should fail.');
          done();
        });
    } catch (err) {
      assert.equal(err.toString(), 'Error: when() needs function to operate on.');
      done();
    }
  });

  it('when before pre throws error', (done) => {
    try {
      const order = [];
      new Pipeline({ logger })
        .when(() => false)
        .after(() => { order.push('post1'); })
        .run()
        .then(() => {
          assert.fail('when after once should fail.');
          done();
        });
    } catch (err) {
      assert.equal(err.toString(), 'Error: when() needs function to operate on.');
      done();
    }
  });

  it('Disables pre before unless', (done) => {
    const order = [];
    new Pipeline({ logger })
      .before(() => { order.push('pre0'); })
      .before(() => { order.push('disabled'); })
      .unless(() => true)
      .before(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .after(() => { order.push('post0'); })
      .after(() => { order.push('post1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('Enables pre before when', (done) => {
    const order = [];
    new Pipeline({ logger })
      .before(() => { order.push('pre0'); })
      .before(() => { order.push('enabled'); })
      .when(() => true)
      .before(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .after(() => { order.push('post0'); })
      .after(() => { order.push('post1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'enabled', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('Enables pre before unless', (done) => {
    const order = [];
    new Pipeline({ logger })
      .before(() => { order.push('pre0'); })
      .before(() => { order.push('enabled'); })
      .unless(() => false)
      .before(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .after(() => { order.push('post0'); })
      .after(() => { order.push('post1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'enabled', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('Executes promises', (done) => {
    const retval = new Pipeline({ logger })
      .after(() => Promise.resolve({ foo: 'bar' }))
      .after((v) => {
        assert.equal(v.foo, 'bar');
      }).run();
    retval.then((r) => {
      assert.equal(r.foo, 'bar');
      done();
    });
  });

  it('Executes taps', (done) => {
    new Pipeline({ logger })
      .before(() => ({ foo: 'bar' }))
      .after(() => ({ bar: 'baz' }))
      .every((c, a, i) => { if (i === 1) { done(); } return true; })
      .run();
  });

  it('Does not executes taps when conditions fail', (done) => {
    new Pipeline({ logger })
      .before(() => ({ foo: 'bar' }))
      .after(() => ({ bar: 'baz' }))
      .every((c, a, i) => { if (i === 1) { done(new Error('this is a trap')); } return true; })
      .when(() => false)
      .every((c, a, i) => { if (i === 1) { done(); } return true; })
      .when(() => true)
      .run();
  });
});
