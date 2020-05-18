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
const yaml = require('js-yaml');
const { type } = require('ferrum');
const production = require('../utils/is-production');

/**
 * Custom error for frontmatter parsing errors.
 */
class FrontmatterParsingError extends Error {}

/**
 * Creates the matter tokenizer.
 *
 * @param {object} opts Options
 * @param {Logger} opts.logger Logger.
 *
 * @returns A remark block tokenizer for front matter.
 */
function createTokenizer(opts) {
  const { logger } = opts;

  let startOfDocument = true;

  function warn(msg, sourceref) {
    const err = new FrontmatterParsingError(`${msg}\n${sourceref}`);
    if (!production()) {
      logger.warn(err);
    }
    logger.debug(err);
    return false;
  }

  function info(msg, sourceref) {
    logger.info(`${msg}\n${sourceref}`);
    return false;
  }

  /**
   * Frontmatter tokenizer.
   * @param {function} eat The remark eat function.
   * @param {string} value The input value (markdown)
   */
  return function frontmatter(eat, value) {
    const REGEXP_EMPTY_LINE = /^\s*?(\r\n|\r|\n)/;

    // if start of document
    const wasStart = startOfDocument;
    if (startOfDocument) {
      if (value.charAt(0).trim() === '') {
        // ignore trailing white space
        /* istanbul ignore next */
        return false;
      }
      startOfDocument = false;
    }
    const match = /^---(\r\n|\r|\n)([^]*?)(\r\n|\r|\n)---((\r\n|\r|\n)*$|(\r\n|\r|\n))/.exec(value);
    if (!match) {
      return false;
    }
    const src = match[2];

    // reject ambiguous yaml
    if (/^\s*[^a-zA-Z"{\s-]/m.test(src)) {
      return info(
        'Found ambiguous frontmatter fence: Block contains yaml key not starting a letter. '
        + 'If this was intended, escape the key with quotes. ', src,
      );
    }

    // needs to be end of document or followed by a new line
    const follow = value.substring(match[0].length);
    if (follow.trim() && !REGEXP_EMPTY_LINE.test(follow)) {
      return warn('Found ambiguous frontmatter fence: No empty line after the block! '
        + 'Make sure your mid-document YAML blocks contain no empty lines '
        + 'and your horizontal rules have an empty line before AND after them.', src);
    }

    // try to parse the yaml
    let payload = {};
    let yamlError;
    try {
      payload = yaml.safeLoad(src);
    } catch (e) {
      yamlError = e;
    }

    // reject non-continuous yaml
    if (!wasStart && /(\r\n|\r|\n)\s*(\r\n|\r|\n)/m.test(src)) {
      if (yamlError) {
        // if it wasn't yaml, just ignore.
        /* istanbul ignore next */
        return false;
      }
      return warn(
        'Found ambiguous frontmatter fence: Block contains empty line! '
        + 'Make sure your mid-document YAML blocks contain no empty lines '
        + 'and your horizontal rules have an empty line before AND after them.', src,
      );
    }

    // ensure we only accept YAML objects
    const payloadType = type(payload);
    if (payloadType !== Object) {
      if (payloadType === String || payloadType === Number) {
        // ignore scalar
        return false;
      }
      return warn(
        'Found ambiguous frontmatter block: Block contains valid yaml, but '
        + `it's data type is ${type(payload)} instead of Object.`
        + 'Make sure your yaml blocks contain only key-value pairs at the root level!', src,
      );
    }

    if (yamlError) {
      return warn(`Exception occurred while parsing yaml: ${yamlError}`, src);
    }

    // consume parsed value
    return eat(value.substring(0, match[0].length))({
      type: 'yaml',
      payload,
    });
  };
}

/**
 * Front- and mid-matter remark plugin.
 *
 * Frontmatter looks like this:
 *
 * ```
 * ---
 * Foo: bar
 * ---
 * ```
 *
 * The frontmatter is delimited by a `thematicBreak` made from three
 * dashes in the mdast and contains a yaml-encoded payload.
 *
 * Not any yaml and any thematicBreak is accepted; in order to avoid
 * false positives, the following restrictions apply:
 *
 * - There must be the start or end of the document or an empty line (`\n\n`)
 *   before and after the frontmatter block
 * - There may be no empty line within the frontmatter block; not even lines
 *   containing only whitespace
 * - The yaml must yield an object (as in key-value pairs); strings, numbers or
 *   arrays are not considered to be frontmatter in this context
 * - The thematic break must be made up of three dashes
 *
 * For frontmatter blocks at the beginning of the document, the rules are a bit
 * looser, as there is less risk of confusion:
 * - There must be end of the document or an empty line (`\n\n`) after the
 *   frontmatter block
 * - The yaml must yield an object (as in key-value pairs); strings, numbers or
 *   arrays are not considered to be frontmatter in this context
 * - The thematic break must be made up of three dashes
 *
 * # Future directions
 *
 * This function is likely to change in the following ways:
 *
 * - Relaxed restrictions on what constitutes frontmatter.
 * - The ability to specify custom formats; by specifying the name
 *   of the format explicitly we reduce ambiguity to pretty much zero
 *   and can allow for far more complex frontmatter formats.
 *
 *    ```
 *    ---json
 *    {"foo": 42}
 *    ---
 *    ```
 *
 * # Ambiguous Frontmatter
 *
 * Normally, when one of the conditions above is triggered,
 * (e.g. Frontmatter containing an empty line; not being an array
 * instead of an object), a warning will be emitted instead of the
 * frontmatter being actually parsed & returned.
 * This warning may be processed by the caller in any way; e.g. by
 * printing a warning on the console or by throwing an error...
 *
 * In order to avoid ambiguous cases, the format described above
 * should be used for valid frontmatter; in order to use horizontal
 * rules unambiguously, the markdown author should either use symbols
 * other than dash to mark horizontal rules, or leave at least one empty
 * line before and after the three dashes.
 *
 * Both ways are guaranteed to be interpreted as horizontal rules and
 * never yield warnings.
 */
function matterPlugin(opts) {
  const { blockMethods, blockTokenizers } = this.Parser.prototype;
  blockMethods.unshift('frontmatter');
  blockTokenizers.frontmatter = createTokenizer(opts);
}

module.exports = matterPlugin;
module.exports.FrontmatterParsingError = FrontmatterParsingError;
