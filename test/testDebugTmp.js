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
const fs = require("fs-extra");
const assert = require("assert");
const { Logger } = require("@adobe/helix-shared");

const dumper = require("../src/utils/dump-context.js");

describe("Test Temp Context Dumper", () => {
  it("Writes context dump on loglevel silly", async () => {
    const logger = Logger.getTestLogger({
      level: "silly"
    });

    const action = {
      logger
    };
    await dumper.record({ foo: "bar" }, action, 0, "once:test");
    await dumper.record({ foo: "bar", result: 42 }, action, 1, "after:result");
    const dump0 = action.debug.contextDumps[0];
    assert.equal(dump0.index, 0);
    assert.equal(dump0.name, "test");
    assert.deepEqual(await fs.readJSON(dump0.file), { foo: "bar" });

    const dump1 = action.debug.contextDumps[1];
    assert.equal(dump1.index, 1);
    assert.equal(dump1.name, "result");
    assert.deepEqual(await fs.readJSON(dump1.file), { foo: "bar", result: 42 });

    await dumper.report({}, action);

    // check that files are only written once
    const output = await logger.getOutput();
    assert.equal(output.match(/writing context dump/g).length, 2);
  });

  it("does not write on loglevel debug", async () => {
    const logger = Logger.getTestLogger({
      level: "debug"
    });

    const action = {
      logger
    };
    await dumper.record({ foo: "bar" }, action, 0, "once:test");
    const dump = action.debug.contextDumps[0];
    assert.equal(dump.index, 0);
    assert.equal(dump.name, "test");
    assert.equal(dump.file, undefined);
  });
});
