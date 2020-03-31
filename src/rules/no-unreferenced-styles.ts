import {
  AST_NODE_TYPES,
  TSESTree,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { createRule } from '../utils';

interface Config {
  variableName?: string;
}

type MessageIds = 'unreferencedStyle' | 'notConst';
type Options = [Config];

export default createRule<Options, MessageIds>({
  name: 'no-unreferenced-styles',
  meta: {
    docs: {
      description: `disallow unused styles`,
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      unreferencedStyle: 'Unreferenced style',
      notConst: 'Styles array is not marked const',
    },
    schema: [
      {
        type: 'object',
        properties: {
          variableName: {
            type: 'string',
          },
        },
      },
    ],
    type: 'suggestion',
  },
  defaultOptions: [
    {
      variableName: '_styles',
    },
  ],

  create: function (context, [{ variableName }]) {
    /**
     * getRefsFromObjectPattern
     *
     * @param node
     * @returns {string[]}
     */
    function getRefsFromObjectPattern(node: TSESTree.ObjectPattern): string[] {
      const keys: string[] = [];

      for (const property of node.properties) {
        if (
          property.type === AST_NODE_TYPES.Property &&
          property.key.type === AST_NODE_TYPES.Identifier
        ) {
          if (property.value.type === AST_NODE_TYPES.ObjectPattern) {
            keys.push(
              [
                property.key.name,
                getRefsFromObjectPattern(property.value),
              ].join('.'),
            );
          } else {
            keys.push(property.key.name);
          }
        }
      }

      return keys;
    }

    /**
     * getRefs
     *
     * @param references
     * @returns {Map}
     */
    function getRefs(
      references: TSESLint.Scope.Reference[],
    ): Map<string, string> {
      const refs = new Map<string, string>();

      for (const ref of references) {
        let current: TSESTree.Node | undefined = ref.identifier.parent;
        let keys: string[] = [ref.identifier.name];

        while (current) {
          if (
            current.type === AST_NODE_TYPES.MemberExpression &&
            current.property.type === AST_NODE_TYPES.Identifier
          ) {
            keys.push(current.property.name);
            current = current.parent;
          } else if (current.type === AST_NODE_TYPES.VariableDeclarator) {
            current = current.id;
          } else if (current.type === AST_NODE_TYPES.ObjectPattern) {
            keys = getRefsFromObjectPattern(current).map((ref) =>
              [...keys, ref].join('.'),
            );
            current = undefined;
          } else {
            keys = [keys.join('.')];
            current = undefined;
          }
        }

        for (const key of keys) {
          if (key !== ref.identifier.name && !refs.has(key)) {
            refs.set(key, key);
          }
        }
      }

      return refs;
    }

    /**
     * checkProps
     *
     * @param node
     * @param refs
     * @param parentName
     * @param keys
     * @returns {void}
     */
    function checkProps(
      node: TSESTree.ObjectExpression,
      refs: Map<string, string>,
      parentName: string,
      keys = [parentName],
    ): void {
      for (const property of node.properties) {
        if (
          property.type === AST_NODE_TYPES.Property &&
          property.key.type === AST_NODE_TYPES.Identifier
        ) {
          if (property.value.type === AST_NODE_TYPES.ObjectExpression) {
            checkProps(property.value, refs, parentName, [
              ...keys,
              property.key.name,
            ]);
          }

          if (
            property.value.type === AST_NODE_TYPES.CallExpression &&
            !refs.has([...keys, property.key.name].join('.'))
          ) {
            context.report({ node: property, messageId: 'unreferencedStyle' });
          }
        }
      }
    }

    /**
     * checkUnreferencedStyles
     *
     * @param references
     * @param defs
     * @returns {void}
     */
    function checkUnreferencedStyles({
      references,
      defs,
    }: TSESLint.Scope.Variable): void {
      const [def] = defs;
      const node = def.node as TSESTree.Node;

      if (node.type !== AST_NODE_TYPES.VariableDeclarator) {
        return;
      }

      if (
        node.parent &&
        node.parent.type === AST_NODE_TYPES.VariableDeclaration &&
        node.parent.kind !== 'const'
      ) {
        context.report({ node: node.parent, messageId: 'notConst' });
        return;
      }

      if (
        node.id &&
        node.id.type === AST_NODE_TYPES.Identifier &&
        node.init &&
        node.init.type === AST_NODE_TYPES.ObjectExpression
      ) {
        checkProps(node.init, getRefs(references), node.id.name);
      }
    }

    /**
     * findVariable
     *
     * @param scope
     * @returns {TSESLint.Scope.Variable | undefined}
     */
    function findVariable(
      scope: TSESLint.Scope.Scope,
    ): TSESLint.Scope.Variable | undefined {
      const variable = scope.variables.find(
        (variable) => variable.name === variableName,
      );
      if (variable) {
        return variable;
      }

      for (const childScope of scope.childScopes) {
        const variable = findVariable(childScope);
        if (variable) {
          return variable;
        }
      }

      return undefined;
    }

    return {
      Program(): void {
        const variable = findVariable(context.getScope());
        if (!variable) {
          return;
        }

        checkUnreferencedStyles(variable);
      },
    };
  },
});
