import { RuleTester } from '../support/RuleTester';
import rule from '../../src/rules/incorrect-this-props';

const ruleTester = new RuleTester({
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
  },
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run('incorrect-this-props', rule, {
  valid: [
    {
      code: `
class Foo extends Component {
  bar(props) {
    const prevProps = this.props;
  }
}
      `,
    },
    {
      code: `
class Foo extends Component {
  bar(props) {
    if (props.foo) {}
    const { foo } = props;
  }
}
      `,
    },
    {
      code: `
class Foo extends Component {
  bar() {
    if (this.props.foo) {}
    const { foo } = this.props;
  }
}
      `,
    },
  ],
  invalid: [
    {
      code: `
class Foo extends Component {
  bar(props) {
    const { id } = this.props;
  }
}
      `,
      errors: [
        {
          messageId: 'incorrectThisPropsError',
          line: 4,
          column: 20,
          endColumn: 30,
        },
      ],
    },
    {
      code: `
class Foo extends Component {
  bar(props) {
    const id = this.props.id;
  }
}
      `,
      errors: [
        {
          messageId: 'incorrectThisPropsError',
          line: 4,
          column: 16,
          endColumn: 26,
        },
      ],
    },
    {
      code: `
class Foo extends Component {
  bar(props) {
    const foo = this.props.foo;
    const { bar } = this.props;
  }
}
      `,
      errors: [
        {
          messageId: 'incorrectThisPropsError',
          line: 4,
          column: 17,
          endColumn: 27,
        },
        {
          messageId: 'incorrectThisPropsError',
          line: 5,
          column: 21,
          endColumn: 31,
        },
      ],
    },
  ],
});
