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
const { Pipeline } = require("../../index.js");
const { log } = require("./default.js");

const fetch = require("../html/fetch-markdown.js");
const parse = require("../html/parse-markdown.js");
const meta = require("../html/get-metadata.js");
const type = require("../utils/set-content-type.js");
const smartypants = require("../html/smartypants.js");
const sections = require("../html/split-sections.js");
const production = require("../utils/is-production.js");
const dump = require("../utils/dump-context.js");
const validate = require("../utils/validate.js");
const emit = require("../json/emit-json.js");
const { selectStatus } = require("../json/set-json-status.js");
const parseFrontmatter = require("../html/parse-frontmatter.js");
const timing = require("../utils/timing");

/* eslint newline-per-chained-call: off */

const jsonpipe = (cont, context, action) => {
  action.logger = action.logger || log;
  action.logger.log("debug", "Constructing JSON Pipeline");
  const pipe = new Pipeline(action);
  const timer = timing();
  pipe
    .every(dump.record)
    .every(validate)
    .when(ctx => !production() && !ctx.error)
    .every(timer.update)
    .use(fetch)
    .expose("fetch")
    .use(parse)
    .expose("parse")
    .use(parseFrontmatter)
    .use(smartypants)
    .use(sections)
    .use(meta)
    .expose("meta")
    .use(cont)
    .use(emit)
    .expose("json")
    .use(type("application/json"))
    .use(timer.report)
    .error(dump.report)
    .error(selectStatus(production()));

  action.logger.log("debug", "Running JSON pipeline");
  return pipe.run(context);
};

module.exports.pipe = jsonpipe;
