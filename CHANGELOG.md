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
