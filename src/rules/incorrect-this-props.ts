import {
  AST_NODE_TYPES,
  TSESTree,
} from '@typescript-eslint/experimental-utils';
import { createRule } from '../utils';

type MessageIds = 'incorrectThisPropsError';
type Options = [];

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

    function isProps(node: TSESTree.Node): boolean {
      return node.type === AST_NODE_TYPES.Identifier && node.name === 'props';
    }

    function hasParamProps(node: TSESTree.MethodDefinition): boolean {
      return (
        node.value.type === AST_NODE_TYPES.FunctionExpression &&
        !!node.value.params.find(isProps)
      );
    }

    function enterMethod(node: TSESTree.MethodDefinition) {
      stack.push(hasParamProps(node));
    }

    function exitFunction() {
      stack.pop();
    }

    function checkThisProps(node: TSESTree.ThisExpression): void {
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
      ThisExpression(node) {
        if (!stack[stack.length - 1]) {
          return;
        }

        checkThisProps(node);
      },
    };
  },
});
