# eslint-plugin-reactxp

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/a-tarasyuk/eslint-plugin-reactxp/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/eslint-plugin-reactxp.svg?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-reactxp) ![Travis (.com) master](https://img.shields.io/travis/com/a-tarasyuk/eslint-plugin-reactxp/master.svg?style=flat-square) [![npm downloads](https://img.shields.io/npm/dm/eslint-plugin-reactxp.svg?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-reactxp)

## Installation

```
$ npm i eslint-plugin-reactxp @typescript-eslint/parser --save-dev
```

## Usage

Add `reactxp` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "reactxp"
  ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
  }
}
```

### Or extend recommended config

```json
{
  "extends": "plugin:reactxp/recommended"
}
```

## License and Copyright

This software is released under the terms of the [MIT license](https://github.com/a-tarasyuk/eslint-plugin-reactxp/blob/master/LICENSE.md).