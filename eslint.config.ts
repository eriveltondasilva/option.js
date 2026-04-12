import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import-x'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  { ignores: ['dist/**', 'node_modules/**'] },

  eslint.configs.recommended,

  tseslint.configs.strict,
  tseslint.configs.stylistic,

  {
    files: ['**/*.{ts,mts,cts}'],

    plugins: {
      import: importPlugin,
    },

    languageOptions: {
      parser: tseslint.parser,
      globals: globals.bunBuiltin,
    },

    settings: {
      'import/resolver': {
        typescript: true,
      },
    },

    rules: {
      // TS
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // import
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index'], 'type'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'import/no-duplicates': 'warn',
      'import/newline-after-import': 'warn',

      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',

      'import/no-cycle': 'warn',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'warn',

      'import/first': 'error',
      'import/no-mutable-exports': 'error',

      'import/consistent-type-specifier-style': ['warn', 'prefer-top-level'],
    },
  },

  prettier,
])
