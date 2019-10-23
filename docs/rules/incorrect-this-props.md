# Disallow use `this.props` in methods with the `props` argument

## Rule Details

Examples of **incorrect** code for this rule

```ts
class Foo extends RX.Component {
  componentDidUpdate(props) {
    const id = this.props.id;
    const { userId } = this.props;
  }
}
```

Examples of **correct** code for this rule

```ts
class Foo extends RX.Component {
  componentDidUpdate(props) {
    const prevProps = this.props;
    const id = prevProps.id;
    const { userId } = prevProps;
    const currentId = props.id;
  }
}
```
