import { RuleTester } from '../support/RuleTester';
import rule from '../../src/rules/no-unreferenced-styles';

const ruleTester = new RuleTester({
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
    ecmaFeatures: {
      jsx: true,
    },
  },
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run('no-unreferenced-styles', rule, {
  valid: [
    {
      code: `
const _styles = {
  foo: RX.Styles.createViewStyle({})
}

const a = _styles.foo;
      `,
    },
    {
      code: `
const _styles = {
  foo: RX.Styles.createViewStyle({})
}

const { foo } = _styles;
      `,
    },
    {
      code: `
const _styles = {
  foo: RX.Styles.createViewStyle({})
}

class Foo extends RX.Component {
  render() {
    return (
      <FooComponent style={_styles.foo}></FooComponent>
    );
  }
}
      `,
    },
    {
      code: `
const _styles = {
  foo: {
    bar: RX.Styles.createViewStyle({})
  },
  bar: RX.Styles.createViewStyle({})
}

class Foo extends RX.Component {
  render() {
    return (
      <FooComponent style={[_styles.foo.bar, _styles.bar]}></FooComponent>
    )
  }
}
      `,
    },
    {
      code: `
const _styles = {
  foo: {
    bar: RX.Styles.createViewStyle({})
  },
  bar: RX.Styles.createViewStyle({})
}

class Foo extends RX.Component {
  render() {
    const { foo: { bar: baz }, bar } = _styles;
    return (
      <FooComponent style={[ baz, bar ]}></FooComponent>
    )
  }
}
      `,
    },
    {
      code: `
const styles = {
  foo: RX.Styles.createViewStyle({})
}

const { foo } = styles;
      `,
      options: [{ variableName: 'styles' }],
    },
    {
      code: `const test = {}`,
      options: [
        {
          variableName: 'styles',
        },
      ],
    },
  ],
  invalid: [
    {
      code: `
let _styles = {
  foo: RX.Styles.createViewStyle({})
}

const foo = _style.foo;
      `,
      errors: [{ messageId: 'notConst', line: 2, column: 1 }],
    },
    {
      code: `
const _styles = {
  foo: {
    bar: RX.Styles.createViewStyle({})
  },
  bar: RX.Styles.createViewStyle({})
}

class Foo extends RX.Component {
  render() {
    const { foo: { bar } } = _styles;
    return (
      <FooComponent style={bar}></FooComponent>
    )
  }
}
      `,
      errors: [
        {
          messageId: 'unreferencedStyle',
          endColumn: 37,
          column: 3,
          line: 6,
        },
      ],
    },
    {
      code: `
const _styles = {
  foo: {
    bar: RX.Styles.createViewStyle({})
  },
  bar: RX.Styles.createViewStyle({}),
  baz: RX.Styles.createViewStyle({})
}

class Foo extends RX.Component {
  render() {
    return (
      <FooComponent style={_styles.bar}></FooComponent>
    )
  }
}
      `,
      errors: [
        {
          messageId: 'unreferencedStyle',
          endColumn: 39,
          column: 5,
          line: 4,
        },
        {
          messageId: 'unreferencedStyle',
          endColumn: 37,
          column: 3,
          line: 7,
        },
      ],
    },
    {
      code: `
const styles = {
  foo: RX.Styles.createViewStyle({}),
  baz: RX.Styles.createViewStyle({})
}

class Foo extends RX.Component {
  render() {
    return (
      <FooComponent style={styles.foo}></FooComponent>
    )
  }
}
      `,
      options: [{ variableName: 'styles' }],
      errors: [
        {
          messageId: 'unreferencedStyle',
          endColumn: 37,
          column: 3,
          line: 4,
        },
      ],
    },
    {
      code: `
import * as React from 'react';
import * as RX from 'reactxp';

const _styles = {
  foo: RX.Styles.createViewStyle({}),
  bar: RX.Styles.createViewStyle({}),
  baz: RX.Styles.createViewStyle({}),
}

export class Foo extends RX.Component {
  render() {
    return (
      <FooComponent style={_styles.foo}></FooComponent>
    )
  }
}
      `,
      parserOptions: {
        sourceType: 'module',
      },
      errors: [
        {
          messageId: 'unreferencedStyle',
          endColumn: 37,
          column: 3,
          line: 7,
        },
        {
          messageId: 'unreferencedStyle',
          endColumn: 37,
          column: 3,
          line: 8,
        },
      ],
    },
  ],
});
