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
  level: 'debug',
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
      .pre(() => { order.push('pre0'); })
      .post(() => { order.push('post0'); })
      .pre(() => { order.push('pre1'); })
      .post(() => { order.push('post1'); })
      .once(() => { order.push('once'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('Disables pre before when', (done) => {
    const order = [];
    new Pipeline({ logger })
      .pre(() => { order.push('pre0'); })
      .pre(() => { order.push('disabled'); })
      .when(() => false)
      .pre(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .post(() => { order.push('post0'); })
      .post(() => { order.push('post1'); })
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
      .pre(() => { order.push('pre0'); })
      .pre(() => { order.push('enabled'); })
      .when(() => true)
      .pre(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .post(() => { order.push('post0'); })
      .post(() => { order.push('post1'); })
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
      .pre(() => { order.push('pre0'); })
      .pre(() => { order.push('disabled'); })
      .when(() => Promise.resolve(false))
      .pre(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .post(() => { order.push('post0'); })
      .post(() => { order.push('post1'); })
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
      .pre(() => { order.push('pre0'); })
      .pre(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .post(() => { order.push('post0'); })
      .post(() => { order.push('disabled'); })
      .when(() => false)
      .post(() => { order.push('post1'); })
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
        .pre(() => { order.push('pre0'); })
        .once(() => { order.push('once'); })
        .when(() => false)
        .post(() => { order.push('post1'); })
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
        .post(() => { order.push('post1'); })
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
      .pre(() => { order.push('pre0'); })
      .pre(() => { order.push('disabled'); })
      .unless(() => true)
      .pre(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .post(() => { order.push('post0'); })
      .post(() => { order.push('post1'); })
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
      .pre(() => { order.push('pre0'); })
      .pre(() => { order.push('enabled'); })
      .when(() => true)
      .pre(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .post(() => { order.push('post0'); })
      .post(() => { order.push('post1'); })
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
      .pre(() => { order.push('pre0'); })
      .pre(() => { order.push('enabled'); })
      .unless(() => false)
      .pre(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .post(() => { order.push('post0'); })
      .post(() => { order.push('post1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'enabled', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('Executes promises', (done) => {
    const retval = new Pipeline({ logger })
      .post(() => Promise.resolve({ foo: 'bar' }))
      .post((v) => {
        assert.equal(v.foo, 'bar');
      }).run();
    retval.then((r) => {
      assert.equal(r.foo, 'bar');
      done();
    });
  });

  it('Executes taps', (done) => {
    new Pipeline({ logger })
      .pre(() => ({ foo: 'bar' }))
      .post(() => ({ bar: 'baz' }))
<<<<<<< HEAD
      .tap((c, a, i) => { if (i === 1) { done(); } })
=======
      .every((c, a, i) => { if (i === 1) { done(); } return true; })
>>>>>>> master
      .run();
  });

  it('Does not executes taps when conditions fail', (done) => {
    new Pipeline({ logger })
      .pre(() => ({ foo: 'bar' }))
      .post(() => ({ bar: 'baz' }))
<<<<<<< HEAD
      .tap((c, a, i) => { if (i === 1) { done(new Error('this is a trap')); } })
      .when(() => false)
      .tap((c, a, i) => { if (i === 1) { done(); } })
=======
      .every((c, a, i) => { if (i === 1) { done(new Error('this is a trap')); } return true; })
      .when(() => false)
      .every((c, a, i) => { if (i === 1) { done(); } return true; })
>>>>>>> master
      .when(() => true)
      .run();
  });
});
