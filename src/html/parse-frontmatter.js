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
const { cloneDeep } = require('lodash');
const {
  pipe, identity, type, size,
  join, map, zipLeast2, list, lookahead, filter, enumerate,
  range, reject,
} = require('ferrum');

const { assign } = Object;
const production = require('../utils/is-production');

/**
 * Given an mdast tree and it's text representation, this finds all
 * the frontmatter in it.
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
 * Note that most of the information required to asses these properties
 * is not contained in the mdast itself, which is why this algorithm requires
 * access to the original markdown string. (The mdast is an Abstract Syntax Tree,
 * the proper tool for a task like this would be a Concrete Syntax Tree, but we have
 * no such thing...).
 *
 * Note that converting the mdast to a markdown string will not do, since
 * the generated markdown will be much different.
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
 *
 * @param {Mdast} The object containing the mdast, including the root node and position information!
 * @param {Source} The original markdown
 * @returns {Iterable} Returns an iterable where each element represents either a
 *   block frontmatter or a warning issued.
 *   The order of warnings/frontmatter blocks is the same as in the input document.
 *
 *   Blocks of frontmatter use the following format:
 *
 *   ```
 *   {
 *     type: 'frontmatter',
 *     payload: {...},
 *     start: Number,
 *     end: Number
 *   }
 *   ```
 *
 *   `start` and `end` represent the index of the mdast node
 *   node that starts/ends the frontmatter block.
 *   Just replace all those nodes with an appropriate frontmatter
 *   node containing the payload to actually insert the frontmatter
 *   into the yaml.
 *
 *   Note that the `mdast` block does not necessarily contain
 *   only mdast blocks; settext headers for instance require
 *   us in some cases to
 *
 *   Warnings use the following format:
 *
 *   ```
 *   {
 *     type: 'warning',
 *     warning: String,
 *     source: String, // Source code of the frontmatter block
 *     start: Number, // Node index as in 'frontmatter' type
 *     end: Number, // May be null if the fence is the last in the markdown
 *     cause: Error, // The error that caused the problem if any
 *   }
 *   ```
 */
const findFrontmatter = (mdast, str) => {
  // We do a lot of stuff with regexps here
  const hspace = '[^\\S\\n\\r]'; // Horizontal space
  const re = (x) => new RegExp(x);

  // Access the markdown source of a markdown ast element
  const start = (idx) => mdast.children[idx].position.start.offset;
  const end = (idx) => mdast.children[idx].position.end.offset;
  const nodeStr = (idx) => str.slice(start(idx), end(idx));

  // Identifying MDAST nodes which are potential fences (but later
  // still need to be checked more thoroughly)
  const isHead2 = (n) => n.type === 'heading' && n.depth === 2;
  const isHr = (n) => n.type === 'thematicBreak';
  const isPotential = (n) => isHead2(n) || isHr(n);

  // Classifiers for fences: Lets us distinguish actual fences
  // from headers and horizontal rules which should not be altered:
  const decentHead = (n) => n.after && isHead2(n.nod);
  const decentHr = (n) => n.after && n.before;
  const toIgnore = (n) => !n || decentHead(n) || decentHr(n);

  const procwarnigns = map(([fst, last]) => {
    const src = str.slice(fst.offStart, last === null ? undefined : last.offEnd);

    const warn = (cause, prosa) => ({
      type: 'warning',
      warning: prosa,
      source: src,
      fst,
      last,
      start: fst.idx,
      end: last && last.idx,
      cause,
    });

    if (!fst.before) {
      return warn(null,
        'Found ambigous frontmatter fence: No empty line before the block! '
          + 'Make sure your mid-document YAML blocks contain no empty lines '
          + 'and your horizontal rules have an empty line before AND after them.');
    } else if (last && !last.after && fst.idx > 0) {
      return warn(null,
        'Found ambigous frontmatter fence: No empty line after the block! '
          + 'Make sure your mid-document YAML blocks contain no empty lines '
          + 'and your horizontal rules have an empty line before AND after them.');
    } else if (src.match(re(`\\n${hspace}*\\n`)) && fst.idx > 0) {
      return warn(null,
        'Found ambigous frontmatter fence: Block contains empty line! '
          + 'Make sure your mid-document YAML blocks contain no empty lines '
          + 'and your horizontal rules have an empty line before AND after them.');
    }

    const txt = str.slice(fst.offEnd, last === null ? undefined : last.offStart);
    let data;
    try {
      data = yaml.safeLoad(txt);
    } catch (e) {
      return warn(e, `Exception ocurred while parsing yaml: ${e}`);
    }

    if (type(data) !== Object) {
      return warn(null,
        'Found ambigous frontmatter block: Block contains valid yaml, but '
          + `it's data type is ${type(data)} instead of Object.`
          + 'Make sure your yaml blocks contain only key-value pairs at the root level!');
    }

    return {
      type: 'frontmatter',
      payload: data,
      start: fst.idx,
      end: last.idx,
    };
  });

  // Preprocessing
  return pipe(
    enumerate(mdast.children),
    // Find any potential frontmatter starts/ends in the mdast
    /* eslint-disable-next-line no-unused-vars */
    filter(([idx, nod]) => isPotential(nod)),
    // Filter out dom nodes based on their actual text content;
    // this filters out HRs made from other characters or setext
    // headings with more than three dashes...
    //
    // And: Perform some more sophisticated feature extraction on the nodes
    map(([idx, nod]) => {
      const mat = nodeStr(idx).match(re(`(?<=^|\\n)---${hspace}*\\n?$`));
      if (!mat) {
        return null;
      }
      // Offset of the actual separator line (this may deviate from the)
      const offStart = mat.index + start(idx);
      const offEnd = offStart + size(mat[0]);
      // Is there a new line or EOF before/after the separator?
      const before = Boolean(str.slice(0, offStart).match(re(`(^|(^|\\n)${hspace}*\\n)$`)));
      const after = Boolean(str.slice(offEnd).match(re(`^(${hspace}*(\\n${hspace}*(\\n|$))|$)`)));
      return {
        idx, nod, offStart, offEnd, before, after,
      };
    }),
    filter(identity),
    // Pair up two fences each; we even do this if there is only a single
    // fence (even though by definition that could never form a frontmatter
    // block) in order to warn about ambiguous nodes
    lookahead(1, null),
    // Filter out pairs in which both the start and the end is definately
    // a settext heading or <hr>
    reject(([fst, last]) => toIgnore(fst) && toIgnore(last)),
    // Decide which blocks to ignore, which deserve warnings and which
    // are actual frontmatter
    procwarnigns,
    filter(identity),
    // Filter out false positive warnings for pseudo frontmatter blocks
    // before actual frontmatter (warning gets invalidated by the fact
    // that it DIRECTLY PRECEDES an actual frontmatter block)
    lookahead(1, null),
    reject(([val, next]) => true
      && val.type === 'warning'
      && val.warning.startsWith('Found ambigous frontmatter')
      && next
      && next.type === 'frontmatter'
      && val.end === next.start),
    /* eslint-disable-next-line no-unused-vars */
    map(([val, next]) => val),
  );
};

class FrontmatterParsingError extends Error {}

const parseFrontmatter = ({ content = {} }, { logger }) => {
  const { mdast, body } = content;

  if (!mdast || !body) {
    return;
  }

  // We splice the mdast.
  let off = 0;

  for (const block of list(findFrontmatter(mdast, body))) {
    if (block.type === 'frontmatter') {
      // Replace all the ast nodes making up a frontmatter block
      // with the respective frontmatter block
      const dat = {
        type: 'yaml',
        payload: block.payload,
        position: {
          start: cloneDeep(mdast.children[block.start + off].position.start),
          end: cloneDeep(mdast.children[block.end + off].position.end),
          indent: [],
        },
      };

      const cnt = block.end - block.start + 1;
      mdast.children.splice(block.start + off, cnt, dat);
      off += -cnt + 1; // cnt removed, 1 inserted
    } else {
      const { warning, source, start } = block;
      const fst = mdast.children[start + off];

      // This also needs to account for settext headings
      // hence the usage of end here, instead of using start
      const { line } = fst.position.end;

      // Source file pretty printing with line numbers
      const sourceref = pipe(
        source.split('\n'),
        zipLeast2(range(line, Infinity)),
        map(([l, no]) => `    ${no} | ${l} `),
        join('\n'),
      );

      const err = new FrontmatterParsingError(`${warning}\n${sourceref}`);
      if (!production()) {
        logger.warn(err);
      }
      logger.debug(err);
    }
  }
};

assign(parseFrontmatter, { findFrontmatter, FrontmatterParsingError });
module.exports = parseFrontmatter;
