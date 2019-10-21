/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const rows = [];

rl.on("line", line => {
  const idx = line.indexOf(":");
  if (idx < 0) {
    return;
  }
  const name = line.substring(0, idx).toLowerCase();
  if (name !== "server-timing") {
    return;
  }
  const timings = line
    .substring(idx + 1)
    .trim()
    .split(",");
  let row = null;
  timings.forEach(t => {
    t = t.trim().split(";");
    const [, time] = t[1].split("=");
    if (t[0] === "total" && rows.length > 0) {
      rows[rows.length - 1].total = time;
    } else {
      const [, desc] = t[2].split("=");
      if (!row) {
        row = {};
        rows.push(row);
      }
      row[desc] = time;
    }
  });
});

rl.on("close", () => {
  const out = process.stdout;
  let headers;
  rows.forEach((row, idx) => {
    if (idx === 0) {
      headers = Object.keys(row);
      headers.forEach(name => {
        out.write(`${name}, `);
      });
      out.write("\n");
    }
    Object.values(row).forEach(value => {
      out.write(`${value}, `);
    });
    out.write("\n");
  });
});
