# Disallow unused styles

## Rule Details

Examples of **incorrect** code for this rule

```ts
let /* Error: Styles array is not marked const */ _styles = {
    foo: RX.Styles.createViewStyle({}),
  };

const foo = _styles.foo;
```

```tsx
const _styles = {
  foo: RX.Styles.createViewStyle({}),
  bar: RX.Styles.createViewStyle({}), // Error: Unreferenced style
};

class Foo extends RX.Component {
  render() {
    const { foo } = _styles;

    return <FooComponent style={foo}></FooComponent>;
  }
}
```

```tsx
const _styles = {
  foo: RX.Styles.createViewStyle({}), // Error: Unreferenced style
  bar: RX.Styles.createViewStyle({}),
  baz: RX.Styles.createViewStyle({}), // Error: Unreferenced style
};

class Foo extends RX.Component {
  render() {
    return <FooComponent style={_styles.bar}></FooComponent>;
  }
}
```

Examples of **correct** code for this rule

```ts
const _styles = {
  foo: RX.Styles.createViewStyle({}),
};

const foo = _styles.foo;
```

```tsx
const _styles = {
  foo: RX.Styles.createViewStyle({}),
};

class Foo extends RX.Component {
  render() {
    return <FooComponent style={_styles.foo}></FooComponent>;
  }
}
```

```tsx
const _styles = {
  foo: RX.Styles.createViewStyle({}),
  bar: RX.Styles.createViewStyle({}),
};

class Foo extends RX.Component {
  render() {
    const { foo, bar } = _styles;

    return <FooComponent style={[foo, bar]}></FooComponent>;
  }
}
```

## Options

```CJSON
{
  "reactxp/no-unreferenced-styles": ["error", { "variableName": "string" }]
}
```
