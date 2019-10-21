export default {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['reactxp'],
  rules: {
    'reactxp/incorrect-this-props': 'error',
    'reactxp/no-unreferenced-styles': 'error',
  },
};
