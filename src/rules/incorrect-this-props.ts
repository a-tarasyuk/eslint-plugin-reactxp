import {
  AST_NODE_TYPES,
  TSESTree,
} from '@typescript-eslint/experimental-utils';
import { createRule } from '../utils';

type MessageIds = 'incorrectThisPropsError';
type Options = [];

const LIFECYCLE_METHODS = [
  'UNSAFE_componentWillReceiveProps',
  'componentWillReceiveProps',

  'UNSAFE_componentWillUpdate',
  'componentWillUpdate',

  'getSnapshotBeforeUpdate',
  'shouldComponentUpdate',
  'componentDidUpdate',
];

export default createRule<Options, MessageIds>({
  name: 'incorrect-this-props',
  meta: {
    docs: {
      description: `Disallow use "this.props" in methods with the "props" argument`,
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      incorrectThisPropsError: `"this.props" referenced within method that takes "props" input parameter.`,
    },
    schema: [],
    type: 'suggestion',
  },
  defaultOptions: [],

  create: function(context) {
    const stack: boolean[] = [];

    /**
     * isProps
     * checks if the identifier name is `props`
     * @param node
     * @returns {boolean}
     */
    function isProps(node: TSESTree.Node): boolean {
      return node.type === AST_NODE_TYPES.Identifier && node.name === 'props';
    }

    /**
     * hasParamProps
     * checks if a method contains argument with the name `props`
     * @param node
     * @returns {boolean}
     */
    function hasParamProps(node: TSESTree.MethodDefinition): boolean {
      return (
        node.value.type === AST_NODE_TYPES.FunctionExpression &&
        !!node.value.params.find(isProps)
      );
    }

    /**
     * enterMethod
     * @param node
     * @returns {void}
     */
    function enterMethod(node: TSESTree.MethodDefinition): void {
      stack.push(
        node.key.type === AST_NODE_TYPES.Identifier &&
          LIFECYCLE_METHODS.includes(node.key.name) &&
          hasParamProps(node),
      );
    }

    /**
     * exitFunction
     * @param node
     * @returns {void}
     */
    function exitFunction(): void {
      stack.pop();
    }

    /**
     * checkThisProps
     * @param node
     * @returns {void}
     */
    function checkThisProps(node: TSESTree.ThisExpression): void {
      if (!stack[stack.length - 1]) {
        return;
      }

      const parent = node.parent;
      if (!parent) {
        return;
      }

      const grandParent = parent.parent;
      if (!grandParent) {
        return;
      }

      const isAssigned =
        grandParent.type === AST_NODE_TYPES.VariableDeclarator &&
        grandParent.id.type === AST_NODE_TYPES.Identifier;

      if (
        parent.type === AST_NODE_TYPES.MemberExpression &&
        parent.property.type === AST_NODE_TYPES.Identifier &&
        parent.property.name === 'props' &&
        !isAssigned
      ) {
        context.report({ node: parent, messageId: 'incorrectThisPropsError' });
      }
    }

    return {
      MethodDefinition: enterMethod,
      'MethodDefinition:exit': exitFunction,
      ThisExpression: checkThisProps,
    };
  },
});
