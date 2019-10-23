# eslint-plugin-reactxp

> ReactXP specific linting rules for ESLint

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/a-tarasyuk/eslint-plugin-reactxp/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/eslint-plugin-reactxp.svg?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-reactxp) [![Travis (.com) master](https://img.shields.io/travis/com/a-tarasyuk/eslint-plugin-reactxp?style=flat-square)](https://travis-ci.com/a-tarasyuk/eslint-plugin-reactxp) [![npm downloads](https://img.shields.io/npm/dm/eslint-plugin-reactxp.svg?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-reactxp)

## Installation

```
$ npm i eslint-plugin-reactxp @typescript-eslint/parser --save-dev
```

## Usage

Add `reactxp` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["reactxp"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "reactxp/no-unreferenced-styles": "error",
    "reactxp/incorrect-this-props": "error"
  }
}
```

### Or extend recommended config

```json
{
  "extends": "plugin:reactxp/recommended"
}
```

## Rules

| Name                                                               | Description                                                    |
| ------------------------------------------------------------------ | -------------------------------------------------------------- |
| [`no-unreferenced-styles`](./docs/rules/no-unreferenced-styles.md) | Disallow unused styles                                         |
| [`incorrect-this-props`](./docs/rules/incorrect-this-props.md)     | Disallow use `this.props` in methods with the `props` argument |

## License and Copyright

This software is released under the terms of the [MIT license](https://github.com/a-tarasyuk/eslint-plugin-reactxp/blob/master/LICENSE.md).
