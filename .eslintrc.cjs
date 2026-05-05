module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Relaxed rules for better development experience
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',

    // General rules
    'no-console': 'warn',
    'no-undef': 'off',
    'prefer-const': 'warn',
    'no-var': 'warn',
    'no-inner-declarations': 'warn',
    'no-empty': 'warn',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // Astro-specific rules
        // set:html used for JSON-LD; safe by construction
        'astro/no-set-html-directive': 'off',
        'astro/no-conflict-set-directives': 'warn',
        'astro/no-unused-define-vars-in-style': 'warn',
      },
    },
    {
      files: ['*.js', '*.cjs'],
      env: {
        node: true,
      },
    },
  ],
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  ignorePatterns: ['dist/', 'node_modules/', '.astro/'],
};
