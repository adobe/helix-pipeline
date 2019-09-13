## [5.3.1](https://github.com/adobe/helix-pipeline/compare/v5.3.0...v5.3.1) (2019-09-13)


### Bug Fixes

* **package:** update dompurify to version 2.0.0 ([afd2d3b](https://github.com/adobe/helix-pipeline/commit/afd2d3b))

# [5.3.0](https://github.com/adobe/helix-pipeline/compare/v5.2.1...v5.3.0) (2019-09-12)


### Bug Fixes

* **smartypants:** speed up smartypants ([623b731](https://github.com/adobe/helix-pipeline/commit/623b731)), closes [#335](https://github.com/adobe/helix-pipeline/issues/335)


### Features

* **cache:** increase cache timeouts and enable stale serving ([cdd8d60](https://github.com/adobe/helix-pipeline/commit/cdd8d60))

## [5.2.1](https://github.com/adobe/helix-pipeline/compare/v5.2.0...v5.2.1) (2019-09-05)


### Bug Fixes

* **package:** update @adobe/helix-shared to version 3.0.0 ([91a4a59](https://github.com/adobe/helix-pipeline/commit/91a4a59))

# [5.2.0](https://github.com/adobe/helix-pipeline/compare/v5.1.0...v5.2.0) (2019-09-03)


### Features

* **pipe:** turn off error-suppression in production when X-Debug: true ([#207](https://github.com/adobe/helix-pipeline/issues/207)) ([1af3061](https://github.com/adobe/helix-pipeline/commit/1af3061))

# [5.1.0](https://github.com/adobe/helix-pipeline/compare/v5.0.1...v5.1.0) (2019-08-30)


### Features

* **fetch:** support authenticated github access ([#72](https://github.com/adobe/helix-pipeline/issues/72)) ([#445](https://github.com/adobe/helix-pipeline/issues/445)) ([2cc1c75](https://github.com/adobe/helix-pipeline/commit/2cc1c75))

## [5.0.1](https://github.com/adobe/helix-pipeline/compare/v5.0.0...v5.0.1) (2019-08-29)


### Bug Fixes

* **dependencies:** npm audit fix ([d4c4f32](https://github.com/adobe/helix-pipeline/commit/d4c4f32))

# [5.0.0](https://github.com/adobe/helix-pipeline/compare/v4.1.0...v5.0.0) (2019-08-22)


### Features

* **pipe:** uniform steps ([#377](https://github.com/adobe/helix-pipeline/issues/377)) ([7d9f701](https://github.com/adobe/helix-pipeline/commit/7d9f701))


### BREAKING CHANGES

* **pipe:** removed before(), once() and after() methods in favor of use()
- added new uniform method pipe.use()
- added new method pipe.attach.replace() to replace pipeline steps
- pipe.attach() now public API, accepts object with before, replace and after keys
- removed methods before(), once() and after()

# [4.1.0](https://github.com/adobe/helix-pipeline/compare/v4.0.6...v4.1.0) (2019-08-05)


### Features

* **html pipe:** Unwrap hero images ([9f244ef](https://github.com/adobe/helix-pipeline/commit/9f244ef)), closes [#dbcf627](https://github.com/adobe/helix-pipeline/issues/dbcf627) [#338](https://github.com/adobe/helix-pipeline/issues/338)

## [4.0.6](https://github.com/adobe/helix-pipeline/compare/v4.0.5...v4.0.6) (2019-07-30)


### Bug Fixes

* **cache:** compute surrogate-key based on branch ([61712c5](https://github.com/adobe/helix-pipeline/commit/61712c5)), closes [#430](https://github.com/adobe/helix-pipeline/issues/430)

## [4.0.5](https://github.com/adobe/helix-pipeline/compare/v4.0.4...v4.0.5) (2019-07-18)


### Bug Fixes

* **pipe:** ensure request.headers is present ([#421](https://github.com/adobe/helix-pipeline/issues/421)) ([91aa8e4](https://github.com/adobe/helix-pipeline/commit/91aa8e4)), closes [#413](https://github.com/adobe/helix-pipeline/issues/413)

## [4.0.4](https://github.com/adobe/helix-pipeline/compare/v4.0.3...v4.0.4) (2019-07-18)


### Bug Fixes

* **pipeline:** ignore warning for git-resolve against localhost ([#420](https://github.com/adobe/helix-pipeline/issues/420)) ([50b0730](https://github.com/adobe/helix-pipeline/commit/50b0730)), closes [#418](https://github.com/adobe/helix-pipeline/issues/418)

## [4.0.3](https://github.com/adobe/helix-pipeline/compare/v4.0.2...v4.0.3) (2019-07-18)


### Bug Fixes

* **package:** update @adobe/helix-shared to version 2.0.0 ([ab343fd](https://github.com/adobe/helix-pipeline/commit/ab343fd))

## [4.0.2](https://github.com/adobe/helix-pipeline/compare/v4.0.1...v4.0.2) (2019-07-12)


### Bug Fixes

* **package:** update dependencies to address lodash security issues ([#410](https://github.com/adobe/helix-pipeline/issues/410)) ([b3d25ff](https://github.com/adobe/helix-pipeline/commit/b3d25ff))

## [4.0.1](https://github.com/adobe/helix-pipeline/compare/v4.0.0...v4.0.1) (2019-07-10)


### Bug Fixes

* Migrate to ferrum ([86496c3](https://github.com/adobe/helix-pipeline/commit/86496c3))

# [4.0.0](https://github.com/adobe/helix-pipeline/compare/v3.7.4...v4.0.0) (2019-07-05)


### Features

* **html pipe:** Default pipeline should include <section/>s ([#379](https://github.com/adobe/helix-pipeline/issues/379)) ([27ad875](https://github.com/adobe/helix-pipeline/commit/27ad875)), closes [adobe/helix-cli#1037](https://github.com/adobe/helix-cli/issues/1037) [#279](https://github.com/adobe/helix-pipeline/issues/279)


### BREAKING CHANGES

* **html pipe:** - Remove `context.content.sections` and move the sections directly under
`context.content.mdast`
- Adjust json schemas accordingly
- Move the section yaml meta info to `<node>.meta`
- Move the section types to the mdast `<node>.meta.types`

## [3.7.4](https://github.com/adobe/helix-pipeline/compare/v3.7.3...v3.7.4) (2019-07-04)


### Bug Fixes

* **security:** .snyk, package.json & package-lock.json to reduce vulnerabilities ([#398](https://github.com/adobe/helix-pipeline/issues/398)) ([851c48f](https://github.com/adobe/helix-pipeline/commit/851c48f))

## [3.7.3](https://github.com/adobe/helix-pipeline/compare/v3.7.2...v3.7.3) (2019-06-27)


### Bug Fixes

* **embed:** use new versioned embed API endpoint ([dfe3011](https://github.com/adobe/helix-pipeline/commit/dfe3011))

## [3.7.2](https://github.com/adobe/helix-pipeline/compare/v3.7.1...v3.7.2) (2019-06-25)


### Bug Fixes

* **package:** update unified to version 8.0.0 ([a284930](https://github.com/adobe/helix-pipeline/commit/a284930))

## [3.7.1](https://github.com/adobe/helix-pipeline/compare/v3.7.0...v3.7.1) (2019-06-21)


### Bug Fixes

* **package:** update @adobe/openwhisk-loggly-wrapper to version 0.4.3 ([01ac087](https://github.com/adobe/helix-pipeline/commit/01ac087))

# [3.7.0](https://github.com/adobe/helix-pipeline/compare/v3.6.0...v3.7.0) (2019-06-21)


### Features

* **caching:** use computeSurrogateKey from helix-shared ([1ad6d9b](https://github.com/adobe/helix-pipeline/commit/1ad6d9b)), closes [#385](https://github.com/adobe/helix-pipeline/issues/385)
* **fetch:** resolve github ref to commit sha ([#384](https://github.com/adobe/helix-pipeline/issues/384)) ([a917b27](https://github.com/adobe/helix-pipeline/commit/a917b27)), closes [#382](https://github.com/adobe/helix-pipeline/issues/382)
* **schema:** Add context.content.data ([a3c5003](https://github.com/adobe/helix-pipeline/commit/a3c5003)), closes [#378](https://github.com/adobe/helix-pipeline/issues/378)

# [3.6.0](https://github.com/adobe/helix-pipeline/compare/v3.5.0...v3.6.0) (2019-06-20)


### Features

* **pipe:** Remove image responsifier ([#381](https://github.com/adobe/helix-pipeline/issues/381)) ([69223a4](https://github.com/adobe/helix-pipeline/commit/69223a4)), closes [#380](https://github.com/adobe/helix-pipeline/issues/380)

# [3.5.0](https://github.com/adobe/helix-pipeline/compare/v3.4.0...v3.5.0) (2019-06-17)


### Features

* **html pipe:** Unwrap hero images ([b50613c](https://github.com/adobe/helix-pipeline/commit/b50613c)), closes [#338](https://github.com/adobe/helix-pipeline/issues/338)

# [3.4.0](https://github.com/adobe/helix-pipeline/compare/v3.3.0...v3.4.0) (2019-06-12)


### Features

* **error:** add response.errorStack for additional information. ([#375](https://github.com/adobe/helix-pipeline/issues/375)) ([e7a264b](https://github.com/adobe/helix-pipeline/commit/e7a264b)), closes [#374](https://github.com/adobe/helix-pipeline/issues/374)

# [3.3.0](https://github.com/adobe/helix-pipeline/compare/v3.2.2...v3.3.0) (2019-06-12)


### Features

* **pipe:** keep context dumps in memory ([#367](https://github.com/adobe/helix-pipeline/issues/367)) ([96e2f08](https://github.com/adobe/helix-pipeline/commit/96e2f08)), closes [#331](https://github.com/adobe/helix-pipeline/issues/331)

## [3.2.2](https://github.com/adobe/helix-pipeline/compare/v3.2.1...v3.2.2) (2019-06-11)


### Bug Fixes

* **openwhisk:** never set the 'error' property of the response. ([5fc020a](https://github.com/adobe/helix-pipeline/commit/5fc020a)), closes [#369](https://github.com/adobe/helix-pipeline/issues/369)

## [3.2.1](https://github.com/adobe/helix-pipeline/compare/v3.2.0...v3.2.1) (2019-06-11)


### Bug Fixes

* **validator:** avoid dynamic require ([#372](https://github.com/adobe/helix-pipeline/issues/372)) ([4a71148](https://github.com/adobe/helix-pipeline/commit/4a71148)), closes [#371](https://github.com/adobe/helix-pipeline/issues/371)

## [2.5.1](https://github.com/adobe/helix-pipeline/compare/v2.5.0...v2.5.1) (2019-06-07)


### Bug Fixes

* **esi:** use single quotes for esi tags ([#364](https://github.com/adobe/helix-pipeline/issues/364)) ([5c1d971](https://github.com/adobe/helix-pipeline/commit/5c1d971)), closes [#363](https://github.com/adobe/helix-pipeline/issues/363)

# [2.5.0](https://github.com/adobe/helix-pipeline/compare/v2.4.0...v2.5.0) (2019-06-06)


### Features

* **html-pipe:** disable sanitizer by default ([876b743](https://github.com/adobe/helix-pipeline/commit/876b743)), closes [#356](https://github.com/adobe/helix-pipeline/issues/356)

# [2.4.0](https://github.com/adobe/helix-pipeline/compare/v2.3.0...v2.4.0) (2019-06-06)


### Features

* **pipe:** use jsdom everywhere ([479cc8a](https://github.com/adobe/helix-pipeline/commit/479cc8a)), closes [#337](https://github.com/adobe/helix-pipeline/issues/337) [#336](https://github.com/adobe/helix-pipeline/issues/336)

# [2.3.0](https://github.com/adobe/helix-pipeline/compare/v2.2.0...v2.3.0) (2019-06-06)


### Features

* **pipe:** use jsdom everywhere ([#349](https://github.com/adobe/helix-pipeline/issues/349)) ([d0e25c3](https://github.com/adobe/helix-pipeline/commit/d0e25c3))

# [2.2.0](https://github.com/adobe/helix-pipeline/compare/v2.1.1...v2.2.0) (2019-05-29)


### Bug Fixes

* **html pipe:** Fix merge conflict ([6abb218](https://github.com/adobe/helix-pipeline/commit/6abb218)), closes [#253](https://github.com/adobe/helix-pipeline/issues/253)
* **html pipe:** Sanitize generated markdown to avoid XSS attacks ([e2d7963](https://github.com/adobe/helix-pipeline/commit/e2d7963)), closes [#253](https://github.com/adobe/helix-pipeline/issues/253)
* **html pipe:** Sanitize generated markdown to avoid XSS attacks ([8c55d0d](https://github.com/adobe/helix-pipeline/commit/8c55d0d)), closes [#253](https://github.com/adobe/helix-pipeline/issues/253)


### Features

* **html pipe:** add support for anchors on headings ([65430d4](https://github.com/adobe/helix-pipeline/commit/65430d4)), closes [#26](https://github.com/adobe/helix-pipeline/issues/26)
* **html pipe:** Allow custom elements and attributes in markdown ([247a6b9](https://github.com/adobe/helix-pipeline/commit/247a6b9)), closes [#253](https://github.com/adobe/helix-pipeline/issues/253)

## [2.1.1](https://github.com/adobe/helix-pipeline/compare/v2.1.0...v2.1.1) (2019-05-27)


### Bug Fixes

* **package:** update hast-util-select to version 3.0.1 ([dfd589e](https://github.com/adobe/helix-pipeline/commit/dfd589e))

# [2.1.0](https://github.com/adobe/helix-pipeline/compare/v2.0.0...v2.1.0) (2019-05-27)


### Features

* **pipe:** add timing information and clean up function name reporting ([#334](https://github.com/adobe/helix-pipeline/issues/334)) ([bf6c779](https://github.com/adobe/helix-pipeline/commit/bf6c779)), closes [#333](https://github.com/adobe/helix-pipeline/issues/333)

# [2.0.0](https://github.com/adobe/helix-pipeline/compare/v1.12.1...v2.0.0) (2019-05-16)


### Bug Fixes

* **pipe:** Do not filter out non-functions before running the pipeline ([083d902](https://github.com/adobe/helix-pipeline/commit/083d902))


### Features

* **pipe:** Simplify pipeline step executor ([2cbfe58](https://github.com/adobe/helix-pipeline/commit/2cbfe58)), closes [#228](https://github.com/adobe/helix-pipeline/issues/228) [#223](https://github.com/adobe/helix-pipeline/issues/223)


### BREAKING CHANGES

* **pipe:** return value from pipeline functions are no longer merged into the context

NOTE: Most of the functional changes live in src/pipeline.js;
most other changes are just refactoring the rest of the code
base to utilize the changes there.

## [1.12.1](https://github.com/adobe/helix-pipeline/compare/v1.12.0...v1.12.1) (2019-05-14)


### Bug Fixes

* **package:** update mdast-util-to-hast to version 6.0.0 ([68f8560](https://github.com/adobe/helix-pipeline/commit/68f8560))

# [1.12.0](https://github.com/adobe/helix-pipeline/compare/v1.11.0...v1.12.0) (2019-05-10)


### Features

* **html:** introduce new hast extension point ([#324](https://github.com/adobe/helix-pipeline/issues/324)) ([325a6b9](https://github.com/adobe/helix-pipeline/commit/325a6b9)), closes [#319](https://github.com/adobe/helix-pipeline/issues/319)

# [1.11.0](https://github.com/adobe/helix-pipeline/compare/v1.10.2...v1.11.0) (2019-05-08)


### Features

* **html:** enable setting of HTTP headers through link and meta HTML tags ([32e4494](https://github.com/adobe/helix-pipeline/commit/32e4494)), closes [#122](https://github.com/adobe/helix-pipeline/issues/122)

## [1.10.2](https://github.com/adobe/helix-pipeline/compare/v1.10.1...v1.10.2) (2019-05-08)


### Bug Fixes

* **package:** update @adobe/helix-shared to version 1.2.0 ([6cac2f0](https://github.com/adobe/helix-pipeline/commit/6cac2f0))

## [1.10.1](https://github.com/adobe/helix-pipeline/compare/v1.10.0...v1.10.1) (2019-05-03)


### Bug Fixes

* **package:** update @adobe/helix-shared to version 0.11.0 ([5936626](https://github.com/adobe/helix-pipeline/commit/5936626))

# [1.10.0](https://github.com/adobe/helix-pipeline/compare/v1.9.2...v1.10.0) (2019-04-30)


### Bug Fixes

* **package:** update @adobe/helix-shared to version 0.10.5 ([54709a9](https://github.com/adobe/helix-pipeline/commit/54709a9))
* **static:** change extension from .esi to .esi ([a936918](https://github.com/adobe/helix-pipeline/commit/a936918))


### Features

* **html:** enable HAST parsing and serialization of HTML responses ([224c665](https://github.com/adobe/helix-pipeline/commit/224c665)), closes [#285](https://github.com/adobe/helix-pipeline/issues/285)
* **html:** rewrite relative asset references to ESI resources ([dce696e](https://github.com/adobe/helix-pipeline/commit/dce696e)), closes [#267](https://github.com/adobe/helix-pipeline/issues/267)
* **html:** rewrite static asset references to ESI includes that provide stable URLs ([aa2538f](https://github.com/adobe/helix-pipeline/commit/aa2538f)), closes [#224](https://github.com/adobe/helix-pipeline/issues/224)

## [1.9.2](https://github.com/adobe/helix-pipeline/compare/v1.9.1...v1.9.2) (2019-04-29)


### Bug Fixes

* **package:** update mdast-util-to-hast to version 5.0.0 ([6fd14ab](https://github.com/adobe/helix-pipeline/commit/6fd14ab))

## [1.9.1](https://github.com/adobe/helix-pipeline/compare/v1.9.0...v1.9.1) (2019-04-26)


### Bug Fixes

* **package:** update hast-to-hyperscript to version 7.0.0 ([cf3cb50](https://github.com/adobe/helix-pipeline/commit/cf3cb50))

# [1.9.0](https://github.com/adobe/helix-pipeline/compare/v1.8.0...v1.9.0) (2019-04-25)


### Features

* **json:** keep response.body as object ([263b637](https://github.com/adobe/helix-pipeline/commit/263b637))
* **json:** refactoring json pipeline ([d67cf53](https://github.com/adobe/helix-pipeline/commit/d67cf53)), closes [#230](https://github.com/adobe/helix-pipeline/issues/230) [#269](https://github.com/adobe/helix-pipeline/issues/269) [#280](https://github.com/adobe/helix-pipeline/issues/280)

# [1.8.0](https://github.com/adobe/helix-pipeline/compare/v1.7.1...v1.8.0) (2019-04-25)


### Bug Fixes

* **embed:** provide fallback with esi:remove when esi include fails ([575391d](https://github.com/adobe/helix-pipeline/commit/575391d)), closes [#267](https://github.com/adobe/helix-pipeline/issues/267)
* **html:** enable (dangerous) HTML in Markdown and pass it through ([93efaf7](https://github.com/adobe/helix-pipeline/commit/93efaf7)), closes [#154](https://github.com/adobe/helix-pipeline/issues/154)
* **html:** ignore HTML tags when generating IDs for headlines ([bdad96c](https://github.com/adobe/helix-pipeline/commit/bdad96c))


### Features

* **embeds:** detect internal embeds ([7af9356](https://github.com/adobe/helix-pipeline/commit/7af9356)), closes [#267](https://github.com/adobe/helix-pipeline/issues/267)
* **transformer:** enable recursive processing in custom handler functions ([0d5193a](https://github.com/adobe/helix-pipeline/commit/0d5193a))

## [1.7.1](https://github.com/adobe/helix-pipeline/compare/v1.7.0...v1.7.1) (2019-04-25)


### Bug Fixes

* **package:** update @adobe/helix-shared to version 0.10.4 ([93bb5ee](https://github.com/adobe/helix-pipeline/commit/93bb5ee))

# [1.7.0](https://github.com/adobe/helix-pipeline/compare/v1.6.0...v1.7.0) (2019-04-24)


### Features

* **xml:** expose extension points ([01d8926](https://github.com/adobe/helix-pipeline/commit/01d8926)), closes [#268](https://github.com/adobe/helix-pipeline/issues/268)
* **xml:** expose extension points ([614e351](https://github.com/adobe/helix-pipeline/commit/614e351)), closes [#268](https://github.com/adobe/helix-pipeline/issues/268)

# [1.6.0](https://github.com/adobe/helix-pipeline/compare/v1.5.3...v1.6.0) (2019-04-23)


### Features

* **xml:** suppress error output in production [#276](https://github.com/adobe/helix-pipeline/issues/276) ([8598926](https://github.com/adobe/helix-pipeline/commit/8598926))

## [1.5.3](https://github.com/adobe/helix-pipeline/compare/v1.5.2...v1.5.3) (2019-04-22)


### Bug Fixes

* **html pipe:** Generate proper identifiers for complex headings ([#273](https://github.com/adobe/helix-pipeline/issues/273)) ([8c1b447](https://github.com/adobe/helix-pipeline/commit/8c1b447)), closes [#26](https://github.com/adobe/helix-pipeline/issues/26)

## [1.5.2](https://github.com/adobe/helix-pipeline/compare/v1.5.1...v1.5.2) (2019-04-22)


### Bug Fixes

* **package:** update jsdom to version 15.0.0 ([52371f3](https://github.com/adobe/helix-pipeline/commit/52371f3))

## [1.5.1](https://github.com/adobe/helix-pipeline/compare/v1.5.0...v1.5.1) (2019-04-19)


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([#271](https://github.com/adobe/helix-pipeline/issues/271)) ([7156dd5](https://github.com/adobe/helix-pipeline/commit/7156dd5))

# [1.5.0](https://github.com/adobe/helix-pipeline/compare/v1.4.0...v1.5.0) (2019-04-16)


### Features

* **html pipe:** add support for anchors on headings ([f52f768](https://github.com/adobe/helix-pipeline/commit/f52f768)), closes [#26](https://github.com/adobe/helix-pipeline/issues/26)

# [1.4.0](https://github.com/adobe/helix-pipeline/compare/v1.3.5...v1.4.0) (2019-04-16)


### Features

* **openwhisk:** add request.pathInfo ([#257](https://github.com/adobe/helix-pipeline/issues/257)) ([8485626](https://github.com/adobe/helix-pipeline/commit/8485626)), closes [#255](https://github.com/adobe/helix-pipeline/issues/255)

## [1.3.5](https://github.com/adobe/helix-pipeline/compare/v1.3.4...v1.3.5) (2019-04-12)


### Bug Fixes

* **openwhisk:** directory index information is not available anymore ([#259](https://github.com/adobe/helix-pipeline/issues/259)) ([5ac70b4](https://github.com/adobe/helix-pipeline/commit/5ac70b4)), closes [#258](https://github.com/adobe/helix-pipeline/issues/258)

## [1.3.4](https://github.com/adobe/helix-pipeline/compare/v1.3.3...v1.3.4) (2019-04-12)


### Bug Fixes

* **embed:** adjust to new micromatch API ([8c8ce3a](https://github.com/adobe/helix-pipeline/commit/8c8ce3a))
* **package:** update micromatch to version 4.0.0 ([bb43d96](https://github.com/adobe/helix-pipeline/commit/bb43d96))

## [1.3.3](https://github.com/adobe/helix-pipeline/compare/v1.3.2...v1.3.3) (2019-04-12)


### Bug Fixes

* **openwhisk:** context.request.path & context.request.url are incorrect for subdirectory strains ([#256](https://github.com/adobe/helix-pipeline/issues/256)) ([7fce752](https://github.com/adobe/helix-pipeline/commit/7fce752)), closes [#254](https://github.com/adobe/helix-pipeline/issues/254)

## [1.3.2](https://github.com/adobe/helix-pipeline/compare/v1.3.1...v1.3.2) (2019-04-12)


### Bug Fixes

* **openwhisk:** properly propagate error in action response ([#238](https://github.com/adobe/helix-pipeline/issues/238)) ([c680eed](https://github.com/adobe/helix-pipeline/commit/c680eed)), closes [#237](https://github.com/adobe/helix-pipeline/issues/237)

## [1.3.1](https://github.com/adobe/helix-pipeline/compare/v1.3.0...v1.3.1) (2019-04-11)


### Bug Fixes

* **package:** update @adobe/helix-shared to version 0.10.3 ([ce30189](https://github.com/adobe/helix-pipeline/commit/ce30189))

### Features

* **openwhisk**: add request body to payload #235


# [1.3.0](https://github.com/adobe/helix-pipeline/compare/v1.2.4...v1.3.0) (2019-04-10)


### Features

* **logs:** Make context dump subdirectory names be more meaningful ([#249](https://github.com/adobe/helix-pipeline/issues/249)) ([5c2cadb](https://github.com/adobe/helix-pipeline/commit/5c2cadb))

## [1.2.4](https://github.com/adobe/helix-pipeline/compare/v1.2.3...v1.2.4) (2019-04-10)


### Bug Fixes

* **package:** update @adobe/helix-shared to version 0.10.2 ([e721824](https://github.com/adobe/helix-pipeline/commit/e721824)), closes [#246](https://github.com/adobe/helix-pipeline/issues/246)

## [1.2.3](https://github.com/adobe/helix-pipeline/compare/v1.2.2...v1.2.3) (2019-04-08)


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([859e54a](https://github.com/adobe/helix-pipeline/commit/859e54a))
* package.json & package-lock.json to reduce vulnerabilities ([f51940b](https://github.com/adobe/helix-pipeline/commit/f51940b))

## [1.2.2](https://github.com/adobe/helix-pipeline/compare/v1.2.1...v1.2.2) (2019-04-01)


### Bug Fixes

* **markdown:** [#158](https://github.com/adobe/helix-pipeline/issues/158) GFM Tables crash the pipeline ([4a4546f](https://github.com/adobe/helix-pipeline/commit/4a4546f))
* **package:** update xmlbuilder to version 12.0.0 ([b65ffc6](https://github.com/adobe/helix-pipeline/commit/b65ffc6))

## [1.2.1](https://github.com/adobe/helix-pipeline/compare/v1.2.0...v1.2.1) (2019-04-01)


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([f40f12c](https://github.com/adobe/helix-pipeline/commit/f40f12c))

# [1.2.0](https://github.com/adobe/helix-pipeline/compare/v1.1.1...v1.2.0) (2019-03-28)


### Features

* Pipeline now supports pipeline steps that mutate the input ([2b6ddf0](https://github.com/adobe/helix-pipeline/commit/2b6ddf0))

## [1.1.1](https://github.com/adobe/helix-pipeline/compare/v1.1.0...v1.1.1) (2019-03-22)


### Bug Fixes

* **package:** update @adobe/helix-shared to version 0.8.3 ([2a3387e](https://github.com/adobe/helix-pipeline/commit/2a3387e))

# [1.1.0](https://github.com/adobe/helix-pipeline/compare/v1.0.6...v1.1.0) (2019-03-21)


### Bug Fixes

* **pipeline:** Fix off-by-one error in pipeline extensibility ([89ea8f5](https://github.com/adobe/helix-pipeline/commit/89ea8f5))


### Features

* **pipeline:** Add advanced extensibility support ([7aa691b](https://github.com/adobe/helix-pipeline/commit/7aa691b))
* **pipeline:** Introduced explicit, named extension points ([461d3f6](https://github.com/adobe/helix-pipeline/commit/461d3f6))

## [1.0.6](https://github.com/adobe/helix-pipeline/compare/v1.0.5...v1.0.6) (2019-03-20)


### Bug Fixes

* **release:** semantic-release now updates package.json ([fcb78b8](https://github.com/adobe/helix-pipeline/commit/fcb78b8)), closes [#212](https://github.com/adobe/helix-pipeline/issues/212)

## [1.0.5](https://github.com/adobe/helix-pipeline/compare/v1.0.4...v1.0.5) (2019-03-19)


### Bug Fixes

* **markdown:** Fix handling of references in Markdown validation ([4d69499](https://github.com/adobe/helix-pipeline/commit/4d69499)), closes [#159](https://github.com/adobe/helix-pipeline/issues/159)

## [1.0.4](https://github.com/adobe/helix-pipeline/compare/v1.0.3...v1.0.4) (2019-03-14)


### Bug Fixes

* Smoke test workflow sporadically fails while smoke tests were successful ([f93a120](https://github.com/adobe/helix-pipeline/commit/f93a120))
* Smoke test workflow sporadically fails while smoke tests were successful ([afa4615](https://github.com/adobe/helix-pipeline/commit/afa4615))

## [1.0.3](https://github.com/adobe/helix-pipeline/compare/v1.0.2...v1.0.3) (2019-03-14)


### Bug Fixes

* **pipeline:** don't hide stack trace from errors ([b911467](https://github.com/adobe/helix-pipeline/commit/b911467))

## [1.0.2](https://github.com/adobe/helix-pipeline/compare/v1.0.1...v1.0.2) (2019-03-11)


### Bug Fixes

* **package:** update @adobe/helix-shared to version 0.8.1 ([cfd0a72](https://github.com/adobe/helix-pipeline/commit/cfd0a72))

## [1.0.1](https://github.com/adobe/helix-pipeline/compare/v1.0.0...v1.0.1) (2019-03-10)


### Bug Fixes

* **package:** update jsdom to version 14.0.0 ([c83dc60](https://github.com/adobe/helix-pipeline/commit/c83dc60))
