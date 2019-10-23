import { ESLintUtils } from '@typescript-eslint/experimental-utils';
export const createRule = ESLintUtils.RuleCreator(
  name =>
    `https://github.com/a-tarasyuk/eslint-plugin-reactxp/tree/master/docs/rules/${name}.md`,
);
