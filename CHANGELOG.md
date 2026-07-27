# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.4.1](https://github.com/renatoxm/leanagentkit/compare/v1.4.0...v1.4.1) (2026-07-27)


### Bug Fixes

* **bootstrap:** merge existing AGENTS.md instead of erasing it ([ea43023](https://github.com/renatoxm/leanagentkit/commit/ea430239d632f8e3b916eb7ac4ec62ceb6ffedfc))

## [1.4.0](https://github.com/renatoxm/leanagentkit/compare/v1.3.0...v1.4.0) (2026-07-23)


### Features

* **spec:** add portable plan gate and skip bootstrap pack re-offer ([f55ab3c](https://github.com/renatoxm/leanagentkit/commit/f55ab3c4d4bac9639e7b2d3a28f8e37a2894cfb7))
* **spec:** prefer Cursor Plan Build with portable implement bypass ([53a08e8](https://github.com/renatoxm/leanagentkit/commit/53a08e87d84c1f5a7e8ca49ffdc34c71f55375fe))

## [1.3.0](https://github.com/renatoxm/leanagentkit/compare/v1.2.0...v1.3.0) (2026-07-22)


### Features

* **stacks:** record commitlint limits and clarify scaffold-only helpers ([92f9f0d](https://github.com/renatoxm/leanagentkit/commit/92f9f0d098cdafc5cdf69d1795a7d09a32ab2323))

## [1.2.0](https://github.com/renatoxm/leanagentkit/compare/v1.1.2...v1.2.0) (2026-07-21)


### Features

* **cli:** add guided TTY installer ([f317f2e](https://github.com/renatoxm/leanagentkit/commit/f317f2ed71b6ddff3b2a106c7ed74f31db892c78))

## [1.1.2](https://github.com/renatoxm/leanagentkit/compare/v1.1.1...v1.1.2) (2026-07-21)

## [1.1.1](https://github.com/renatoxm/leanagentkit/compare/v1.1.0...v1.1.1) (2026-07-21)

## [1.1.0](https://github.com/renatoxm/leanagentkit/compare/v1.0.0...v1.1.0) (2026-07-20)


### Features

* add imaginary image-processing pack ([0ef39f3](https://github.com/renatoxm/leanagentkit/commit/0ef39f3684c8f6d4bcdcaecd940301eb9759f179))

## [1.0.0](https://github.com/renatoxm/leanagentkit/compare/v0.4.21...v1.0.0) (2026-07-17)


### ⚠ BREAKING CHANGES

* rebuild kit around lean core and opt-in packs

### Features

* rebuild kit around lean core and opt-in packs ([f915a0d](https://github.com/renatoxm/leanagentkit/commit/f915a0de3be35ad56e62ad8a536713f412fc68a9))

## [1.0.0](https://github.com/renatoxm/leanagentkit/compare/v0.4.21...v1.0.0) (2026-07-17)

### ⚠ BREAKING CHANGES

* Default scaffold installs **lean core only** (not the full skill set).
* Template layout is `template/core/` + `template/packs/*` (opt-in overlays).
* Memory protocol is **map-first** (narrow search allowed); workflow sizes trivial/normal/substantial.
* Optional features (spec, stacks, practice, Trevor, Caveman, …) require `--enable-pack` / `--with`.

### Features

* CLI: `--with`, `--enable-pack`, `--prune-to-core`, `--keep-pack`
* Version stamp includes `installedPacks`
* Skills: `leanagentkit-enable-pack`, `leanagentkit-migrate-1`
* Docs: packs catalog, migration 1.0, rewritten guide/READMEs

### Migration

```bash
npx create-lean-agent-kit@latest . --upgrade
npx create-lean-agent-kit@latest . --prune-to-core   # optional lean reclaim
npx create-lean-agent-kit@latest . --enable-pack spec,stacks
```

See https://renatoxm.github.io/leanagentkit/migration-1.0

## [0.4.21](https://github.com/renatoxm/leanagentkit/compare/v0.4.20...v0.4.21) (2026-07-12)

## [0.4.20](https://github.com/renatoxm/leanagentkit/compare/v0.4.19...v0.4.20) (2026-07-12)


### Bug Fixes

* **cli:** print version banner so stale npx caches are obvious ([215be57](https://github.com/renatoxm/leanagentkit/commit/215be5777d28dcccc6415931d44869a9cdf31904))

## [0.4.19](https://github.com/renatoxm/leanagentkit/compare/v0.4.18...v0.4.19) (2026-07-12)


### Bug Fixes

* **cli:** fail loudly on unknown flags and accidental re-scaffold ([35d6d8d](https://github.com/renatoxm/leanagentkit/commit/35d6d8df9da3ff2e6cf7470313ed69ecadd6e8f8))

## [0.4.18](https://github.com/renatoxm/leanagentkit/compare/v0.4.17...v0.4.18) (2026-07-12)

## [0.4.17](https://github.com/renatoxm/leanagentkit/compare/v0.4.16...v0.4.17) (2026-07-11)


### Bug Fixes

* remediate code review findings across CLI, scaffolders, and skills ([d68ec38](https://github.com/renatoxm/leanagentkit/commit/d68ec38851a78eadb32d2aaaeba33b90d56924c9))

## [0.4.16](https://github.com/renatoxm/leanagentkit/compare/v0.4.15...v0.4.16) (2026-07-11)


### Features

* **scaffold:** add commit-helpers snippets for commitlint and husky ([767890f](https://github.com/renatoxm/leanagentkit/commit/767890f2886dc9ff7df2e1de5870625246fb2e86))
* **scaffold:** offer optional commitlint and husky during scaffold ([b010a58](https://github.com/renatoxm/leanagentkit/commit/b010a588300ad78563eb8ab57dadc0d1d5d688d8))
* **skills:** add leanagentkit-frontend-design always-on guardrail ([b462b21](https://github.com/renatoxm/leanagentkit/commit/b462b213f6b876f618b60d8a516decef0e1db85d))

## [0.4.15](https://github.com/renatoxm/leanagentkit/compare/v0.4.14...v0.4.15) (2026-07-07)


### Features

* **skills:** add interactive handoff after spec authoring ([a967395](https://github.com/renatoxm/leanagentkit/commit/a9673958bf9f83abfcfb6994ee7539cf7e17dd58))


### Bug Fixes

* **scaffold:** abort kit-only in-place CLI scaffolds that block in agent shells ([496ef07](https://github.com/renatoxm/leanagentkit/commit/496ef07a2e4f709967a1c48ae3fa2ad16df1994d))

## [0.4.14](https://github.com/renatoxm/leanagentkit/compare/v0.4.13...v0.4.14) (2026-07-05)


### Features

* add architecture-guided spec decomposition and parallel slices ([00baa24](https://github.com/renatoxm/leanagentkit/commit/00baa240e186c687e5dbd8a157b337b9be759415))

## [0.4.13](https://github.com/renatoxm/leanagentkit/compare/v0.4.12...v0.4.13) (2026-07-05)


### Features

* add leanagentkit-create-skill for authoring and refactoring skills ([a41eba6](https://github.com/renatoxm/leanagentkit/commit/a41eba64b289dd9176dec8a31e109d6c92cfc1e6))

## [0.4.12](https://github.com/renatoxm/leanagentkit/compare/v0.4.11...v0.4.12) (2026-07-05)


### Features

* add optional Caveman token-efficiency skills ([d417bca](https://github.com/renatoxm/leanagentkit/commit/d417bcad1cd6f3bb77d825484789d05314c0cd7d))

## [0.4.11](https://github.com/renatoxm/leanagentkit/compare/v0.4.10...v0.4.11) (2026-07-03)

## [0.4.10](https://github.com/renatoxm/leanagentkit/compare/v0.4.9...v0.4.10) (2026-07-02)


### Features

* add leanagentkit-ask-trevor optional kit concierge assistant ([4f8dc46](https://github.com/renatoxm/leanagentkit/commit/4f8dc4608127009f166fa3f49133f81f67f4a3ff))

## [0.4.9](https://github.com/renatoxm/leanagentkit/compare/v0.4.8...v0.4.9) (2026-07-02)


### Features

* add leanagentkit-git-lifecycle for optional git prompts at spec workflow boundaries ([d0391cd](https://github.com/renatoxm/leanagentkit/commit/d0391cd1c48729a955470ef1676fe3b28cd90428))

## [0.4.8](https://github.com/renatoxm/leanagentkit/compare/v0.4.7...v0.4.8) (2026-07-02)


### Bug Fixes

* **ci:** silence punycode warnings from cache and artifact actions ([3a273d8](https://github.com/renatoxm/leanagentkit/commit/3a273d89730e26d11e0868ff8f10e0fcdd878e7f))

## [0.4.7](https://github.com/renatoxm/leanagentkit/compare/v0.4.6...v0.4.7) (2026-07-02)

## [0.4.6](https://github.com/renatoxm/leanagentkit/compare/v0.4.5...v0.4.6) (2026-07-02)


### Bug Fixes

* **docs:** render mermaid diagrams in VitePress site ([5f474e3](https://github.com/renatoxm/leanagentkit/commit/5f474e399fee067b27aa75acb4933df38ebf49af))
* **docs:** replace ladder emoji with merge symbol for workflows section ([1c3a827](https://github.com/renatoxm/leanagentkit/commit/1c3a827ea25819c3e7992f8e1c5188cd1ce5bec7))

## [0.4.5](https://github.com/renatoxm/leanagentkit/compare/v0.4.4...v0.4.5) (2026-07-02)


### Features

* add leanagentkit-backlog skill for optional Backlog.md integration ([3ec1659](https://github.com/renatoxm/leanagentkit/commit/3ec16599d9cb2f25b3fe874bb11bc129eaacfa70))

## [0.4.4](https://github.com/renatoxm/leanagentkit/compare/v0.4.3...v0.4.4) (2026-07-02)

## [0.4.3](https://github.com/renatoxm/leanagentkit/compare/v0.4.2...v0.4.3) (2026-07-02)


### Features

* add leanagentkit-scaffold for greenfield and additive project setup ([6c60d26](https://github.com/renatoxm/leanagentkit/commit/6c60d26940516d269b7f5d2b529681a4159ea0bf))

## [0.4.2](https://github.com/renatoxm/leanagentkit/compare/v0.4.1...v0.4.2) (2026-07-02)


### Features

* add leanagentkit-tdd and leanagentkit-spike skills ([6cf4b5a](https://github.com/renatoxm/leanagentkit/commit/6cf4b5a0a79abc8989358f2d3ea8a17fce2e40be))

## [0.4.1](https://github.com/renatoxm/leanagentkit/compare/v0.3.13...v0.4.1) (2026-07-02)


### Features

* add self-improving skill loop (distill, curate, agentskills.io standards) ([206820f](https://github.com/renatoxm/leanagentkit/commit/206820fb28cb68444ea5ca722778663080f3d56a))

## [0.3.13](https://github.com/renatoxm/leanagentkit/compare/v0.3.12...v0.3.13) (2026-07-01)


### Features

* hand off ([740d92b](https://github.com/renatoxm/leanagentkit/commit/740d92bddb366eeafd7629e030737165731a9c32))

## [0.3.12](https://github.com/renatoxm/leanagentkit/compare/v0.3.11...v0.3.12) (2026-07-01)


### Features

* added ask and debug modes support into skills ([8a87ae7](https://github.com/renatoxm/leanagentkit/commit/8a87ae74408336aee225626735fd0394e9cad66b))

## [0.3.11](https://github.com/renatoxm/leanagentkit/compare/v0.3.10...v0.3.11) (2026-07-01)


### Features

* hand out to plan mode ([e864c4c](https://github.com/renatoxm/leanagentkit/commit/e864c4cac0d402f006dbfe02f1de98111ee300d5))

## [0.3.10](https://github.com/renatoxm/leanagentkit/compare/v0.3.9...v0.3.10) (2026-07-01)

## [0.3.9](https://github.com/renatoxm/leanagentkit/compare/v0.3.8...v0.3.9) (2026-07-01)


### Bug Fixes

* pnpm version in /docs ([cec6566](https://github.com/renatoxm/leanagentkit/commit/cec6566e66952de020922880961369dfa9541f56))

## [0.3.8](https://github.com/renatoxm/leanagentkit/compare/v0.3.7...v0.3.8) (2026-07-01)


### Features

* github pages created ([8234f05](https://github.com/renatoxm/leanagentkit/commit/8234f050788db1da6c3cc60ea145c22adbc5e8b5))

## [0.3.7](https://github.com/renatoxm/leanagentkit/compare/v0.3.6...v0.3.7) (2026-06-30)


### Features

* upgrade feature ([a3c5863](https://github.com/renatoxm/leanagentkit/commit/a3c5863113c3ce10e7e86ada66089d11790984d9))

## [0.3.6](https://github.com/renatoxm/leanagentkit/compare/v0.3.5...v0.3.6) (2026-06-30)


### Features

* numbered specs ([d7ee769](https://github.com/renatoxm/leanagentkit/commit/d7ee7697ba930ed1726810c98bbe4c6c8a901233))

## [0.3.5](https://github.com/renatoxm/leanagentkit/compare/v0.3.4...v0.3.5) (2026-06-30)


### Features

* interactive questionnaire support added ([f4ab065](https://github.com/renatoxm/leanagentkit/commit/f4ab065dcab14ae622f46cbfa563a02d9f8da7aa))

## [0.3.4](https://github.com/renatoxm/leanagentkit/compare/v0.3.3...v0.3.4) (2026-06-29)

## [0.3.3](https://github.com/renatoxm/leanagentkit/compare/v0.3.2...v0.3.3) (2026-06-29)

## [0.3.2](https://github.com/renatoxm/leanagentkit/compare/v0.3.1...v0.3.2) (2026-06-29)


### Features

* added turborepo support ([eb1bcd5](https://github.com/renatoxm/leanagentkit/commit/eb1bcd505eb2f3fbb8a2f2e1af71cc4f4935ac18))

## [0.3.1](https://github.com/renatoxm/leanagentkit/compare/v0.3.0...v0.3.1) (2026-06-29)


### Features

* added grill me skill and other smaller improvements ([91a8e90](https://github.com/renatoxm/leanagentkit/commit/91a8e90f323581e847b4de071dd8090eb92ff552))

## [0.3.0](https://github.com/renatoxm/leanagentkit/compare/v0.2.0...v0.3.0) (2026-06-27)


### ⚠ BREAKING CHANGES

* Adapted from https://github.com/addyosmani/agent-skills.

### Features

* introduced engineer skills ([2edaf55](https://github.com/renatoxm/leanagentkit/commit/2edaf55ad150c74e2890c3abcdc44381cdbd311d))

## [0.2.0](https://github.com/renatoxm/leanagentkit/compare/v0.1.6...v0.2.0) (2026-06-25)


### ⚠ BREAKING CHANGES

* complete kit evolution

### Features

* leanAgentKit Lean Evolution ([410ea61](https://github.com/renatoxm/leanagentkit/commit/410ea619caeeb166f584dbce487c0f65fa405a07))

## [0.1.6](https://github.com/renatoxm/leanagentkit/compare/v0.1.5...v0.1.6) (2026-06-24)

## [0.1.5](https://github.com/renatoxm/leanagentkit/compare/v0.1.4...v0.1.5) (2026-06-24)

## [0.1.4](https://github.com/renatoxm/leanagentkit/compare/v0.1.3...v0.1.4) (2026-06-24)


### Features

* added cloude support ([9bd5d19](https://github.com/renatoxm/leanagentkit/commit/9bd5d195d4861857c86220e7c8f6e8209a5a1387))
* added cursor ide installation support ([f07bac0](https://github.com/renatoxm/leanagentkit/commit/f07bac030a82c1f73f94aed53126dc64df663581))

## [0.1.3](https://github.com/renatoxm/leanagentkit/compare/v0.1.2...v0.1.3) (2026-06-24)

## [0.1.2](https://github.com/renatoxm/leanagentkit/compare/v0.1.1...v0.1.2) (2026-06-24)

## 0.1.1 (2026-06-24)


### Features

* first commit ([102fde3](https://github.com/renatoxm/leanagentkit/commit/102fde37ee2068d53fa05056057fe55764e389b2))
