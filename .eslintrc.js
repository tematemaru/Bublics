module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint-config-airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  settings: {
    'import/resolver': {
      node: {},
      webpack: {
        config: './webpack',
      },
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'global-require': 'off',
    'no-console': 'off',
    'import/first': 'off',
    'comma-dangle': 'off',
    'no-restricted-properties': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
  },
};
