const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
  {
    files: ['to-do-list-project/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...globals.jquery,
        TodoCalendar: 'writable',
        TodoConfirm: 'writable',
        TodoRender: 'writable',
        TodoStorage: 'writable',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      // Files define these names as browser globals and consume them across script tags.
      'no-redeclare': 'off',
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^Todo(?:Calendar|Confirm|Render|Storage)$' },
      ],
    },
  },
  prettier,
];
