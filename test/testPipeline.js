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
const { Logger } = require('@adobe/helix-shared');
const { Pipeline } = require('../index.js');

/* eslint-disable array-callback-return */
let logger;

describe('Testing Pipeline', () => {
  beforeEach(() => {
    logger = Logger.getTestLogger({
      // tune this for debugging
      level: 'info',
    });
  });

  it('Executes without logger', async () => {
    await new Pipeline().once(() => {}).run({});
  });

  it('Executes correct order', async () => {
    const order = [];
    await new Pipeline({ logger })
      .use(() => { order.push('pre0'); })
      .before(() => { order.push('pre1'); }) // test deprecated before()
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .after(() => { order.push('post1'); }) // test deprecated after()
      .run();
    assert.deepEqual(order, ['pre0', 'pre1', 'once', 'post0', 'post1']);
  });

  it('Can be run twice', async () => {
    const order = [];
    const pipe = new Pipeline({ logger })
      .use(() => { order.push('pre0'); })
      .use(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('post1'); });

    await pipe.run();
    assert.deepEqual(order, ['pre0', 'pre1', 'once', 'post0', 'post1']);

    await pipe.run();
    assert.deepEqual(order, ['pre0', 'pre1', 'once', 'post0', 'post1', 'pre0', 'pre1', 'once', 'post0', 'post1']);
  });

  it('Can be extended', async () => {
    const order = [];

    const first = function first() {
      order.push('one');
    };

    const second = function second() {
      order.push('two');
    };

    const third = function third() {
      order.push('three');
    };

    const fourth = function fourth() {
      order.push('four');
    };

    const newFourth = function newFourth() {
      order.push('4');
    };

    // inject explicit extension points
    [first, second, third, fourth].forEach((f) => {
      f.ext = f.name;
    });

    const pipe = new Pipeline({ logger })
      .use(second)
      .once(() => {
        order.push('middle');
      })
      .use(third);

    pipe.attach.before('second', first);
    pipe.attach.after('third', fourth);
    pipe.attach.replace('fourth', newFourth);

    await pipe.run();
    assert.deepStrictEqual(order, ['one', 'two', 'middle', 'three', '4']);
  });

  it('Can be extended using shorthand syntax', async () => {
    const order = [];

    const first = function first() {
      order.push('one');
    };

    const second = function second() {
      order.push('two');
    };

    const third = function third() {
      order.push('three');
    };

    const fourth = function fourth() {
      order.push('four');
    };

    const newFourth = function newFourth() {
      order.push('4');
    };

    // inject explicit extension points
    [first, second, third, fourth].forEach((f) => {
      f.ext = f.name;
    });

    const middle = function middle() {
      order.push('middle');
    };

    middle.before = {
      second: first,
    };

    middle.after = {
      third: fourth,
    };

    middle.replace = {
      fourth: newFourth,
    };

    const pipe = new Pipeline({ logger })
      .use(second)
      .once(middle)
      .use(third);

    await pipe.run();
    assert.deepStrictEqual(order, ['one', 'two', 'middle', 'three', '4']);
  });

  it('Logs correct names', async () => {
    const order = [];
    const pre0 = () => order.push('pre0');
    const post0 = () => order.push('post0');
    function noOp() {}

    let counter = 0;
    const validatinglogger = {
      error: noOp,
      warn: noOp,
      info: noOp,
      verbose: noOp,
      debug: noOp,
      log: noOp,
      level: 'silly',
      silly(msg, obj) {
        counter += 1;
        if (counter === 1) {
          assert.ok(obj.function.match(/^use:pre0/));
        }
        if (counter === 2) {
          assert.ok(obj.function.match(/^use:anonymous/));
        }
        if (counter === 3) {
          assert.ok(obj.function.match(/^use:post0/));
        }
      },
    };

    await new Pipeline({ logger: validatinglogger })
      .use(pre0)
      .once(() => { order.push('once'); })
      .use(post0)
      .run();
    assert.deepEqual(order, ['pre0', 'once', 'post0']);
  });

  it('Disables pre before when', (done) => {
    const order = [];
    new Pipeline({ logger })
      .use(() => { order.push('pre0'); })
      .use(() => { order.push('disabled'); })
      .when(() => false)
      .use(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('post1'); })
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
      .use(() => { order.push('pre0'); })
      .use(() => { order.push('enabled'); })
      .when(() => true)
      .use(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('post1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'enabled', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('When works with promises resolving false pre before when', (done) => {
    const order = [];
    new Pipeline({ logger })
      .use(() => { order.push('pre0'); })
      .use(() => { order.push('disabled'); })
      .when(() => Promise.resolve(false))
      .use(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('post1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });


  it('When works with promises resolving true pre before when', (done) => {
    const order = [];
    new Pipeline({ logger })
      .use(() => { order.push('pre0'); })
      .use(() => { order.push('enabled'); })
      .when(() => Promise.resolve(true))
      .use(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('post1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'enabled', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('Disables step before when', (done) => {
    const order = [];
    new Pipeline({ logger })
      .use(() => { order.push('pre0'); })
      .use(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('disabled'); })
      .when(() => false)
      .use(() => { order.push('post1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('when after once throws error', () => {
    try {
      const order = [];
      new Pipeline({ logger })
        .use(() => { order.push('pre0'); })
        .once(() => { order.push('once'); })
        .when(() => false)
        .use(() => { order.push('post1'); })
        .run()
        .then(() => {
          assert.fail('when after once should fail.');
          // done();
        });
    } catch (err) {
      assert.equal(err.toString(), 'Error: when() needs function to operate on.');
      // done();
    }
  });

  it('when before pre throws error', (done) => {
    try {
      const order = [];
      new Pipeline({ logger })
        .when(() => false)
        .use(() => { order.push('post1'); })
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
      .use(() => { order.push('pre0'); })
      .use(() => { order.push('disabled'); })
      .unless(() => true)
      .use(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('post1'); })
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
      .use(() => { order.push('pre0'); })
      .use(() => { order.push('enabled'); })
      .when(() => true)
      .use(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('post1'); })
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
      .use(() => { order.push('pre0'); })
      .use(() => { order.push('enabled'); })
      .unless(() => false)
      .use(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('post1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'enabled', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('Executes promises', async () => {
    await new Pipeline({ logger })
      .once((v) => new Promise((resolve) => {
        setTimeout(() => {
          v.foo = 'bar';
          resolve();
        }, 0.05);
      })).use((v) => {
        assert.equal(v.foo, 'bar');
      }).run();
  });

  it('Executes taps', async () => {
    let cnt = 0;
    await new Pipeline({ logger })
      .use(() => {})
      .once(() => {})
      .use(() => {})
      .every(() => {
        cnt += 1;
      })
      .run();
    assert.strictEqual(cnt, 3);
  });

  it('Does not executes taps when conditions fail', async () => {
    let cnt = 0;
    await new Pipeline({ logger })
      .use(() => ({ foo: 'bar' }))
      .once(() => {})
      .use(() => ({ bar: 'baz' }))
      .every(() => {
        assert.fail('this should not be invoked');
      })
      .when(() => false)
      .every(() => {
        cnt += 1;
      })
      .when(() => true)
      .run();
    assert.strictEqual(cnt, 3);
  });

  it('Ignore error if no error', (done) => {
    const order = [];
    new Pipeline({ logger })
      .use(() => { order.push('pre0'); })
      .use(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('post1'); })
      .error(() => { order.push('error'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'pre1', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('skip functions if context.error', (done) => {
    const order = [];
    new Pipeline({ logger })
      .use((ctx) => {
        order.push('pre0');
        ctx.error = new Error();
      })
      .use(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('post1'); })
      .error(() => { order.push('error'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'error']);
        done();
      })
      .catch(done);
  });

  it('skip functions if exception', (done) => {
    const order = [];
    new Pipeline({ logger })
      .use(() => {
        order.push('pre0');
        throw new Error('stop');
      })
      .use(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('post1'); })
      .error(() => { order.push('error'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'error']);
        done();
      })
      .catch(done);
  });

  it('error handler can clear error', (done) => {
    const order = [];
    new Pipeline({ logger })
      .use(() => {
        order.push('pre0');
        throw new Error('stop');
      })
      .use(() => { order.push('pre1'); })
      .error((ctx) => {
        order.push('error0');
        ctx.error = null;
      })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('post1'); })
      .error(() => { order.push('error1'); })
      .run()
      .then(() => {
        assert.deepEqual(order, ['pre0', 'error0', 'once', 'post0', 'post1']);
        done();
      })
      .catch(done);
  });

  it('handles error in error', async () => {
    const order = [];
    await new Pipeline({ logger })
      .use(() => {
        order.push('pre0');
        throw new Error('stop');
      })
      .use(() => { order.push('pre1'); })
      .once(() => { order.push('once'); })
      .use(() => { order.push('post0'); })
      .use(() => { order.push('post1'); })
      .error(() => { throw Error('in error handler'); })
      .run();
    const output = await logger.getOutput();
    assert.deepEqual(order, ['pre0']);
    assert.ok(output.indexOf('Exception during #05/error:anonymous') > 0);
  });

  it('handles generic pipeline error', async () => {
    const order = [];
    await new Pipeline({ logger })
      .use(() => { order.push('pre1'); })
      .once({
        get errorHandler() {
          throw new Error('generic error');
        },
      })
      .error(() => { order.push('error'); })
      .run();

    const output = await logger.getOutput();
    assert.deepEqual(order, ['pre1']);
    assert.ok(output.indexOf('Error: generic error') > 0);
  });
});
