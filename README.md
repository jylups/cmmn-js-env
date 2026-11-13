# cmmn-js-env

Development workspace for the Flowable CMMN viewer and editor packages. It is an
[npm workspace](https://docs.npmjs.com/cli/using-npm/workspaces): the package
repositories are cloned into this folder and installed together, so each package
uses its siblings' local sources instead of the published versions.

| Folder | Repository | Branch |
|---|---|---|
| `cmmn-moddle` | [jylups/cmmn-moddle](https://github.com/jylups/cmmn-moddle) | `master` |
| `flowable-cmmn-moddle` | [jylups/flowable-cmmn-moddle](https://github.com/jylups/flowable-cmmn-moddle) | `main` |
| `cmmn-js` | [jylups/cmmn-js](https://github.com/jylups/cmmn-js) | `master` |
| `cmmn-js-properties-panel-flowable` | [jylups/cmmn-js-properties-panel-flowable](https://github.com/jylups/cmmn-js-properties-panel-flowable) | `master` |

The package folders are ignored by this repository's git; each one is its own
repository.

`diagram-js`, `moddle` and `moddle-xml` are installed from npm at the versions
the packages declare. They are not cloned or linked, because the packages are
not compatible with their current major versions yet.

## Setup

```bash
git clone git@github.com:jylups/cmmn-js-env.git
cd cmmn-js-env
./setup.sh
```

`setup.sh` clones any missing package repository, runs `npm install` at the
root, and builds `cmmn-js/dist` (`npm run build`), whose assets the properties
panel tests load. Run `npm install` at the root again after changing a
package's dependencies, and `npm run build` after changing `cmmn-js`.

## Check the links

```bash
npm ls cmmn-js cmmn-moddle flowable-cmmn-moddle
```

Local packages show as `-> ./<folder>`.

## Run scripts

```bash
npm test --workspace cmmn-js-properties-panel-flowable
npm run lint --workspaces --if-present
```

The karma browser tests run in the installed Google Chrome (headless). Set
`CHROME_BIN` to use a different Chrome or Chromium binary, and `TEST_BROWSERS`
(for example `ChromeHeadless,Firefox`) to pick other browsers.
