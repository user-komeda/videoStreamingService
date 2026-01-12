import js from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
import prettier from 'eslint-config-prettier'
// import turboConfig from 'eslint-config-turbo/flat'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
import reactPlugin from 'eslint-plugin-react'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import testingLibrary from 'eslint-plugin-testing-library'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', '.react-router/', 'build/'] },
  {
    extends: [
      // ...turboConfig,
      js.configs.recommended,
      // eslint-disable-next-line import/no-named-as-default-member
      ...tseslint.configs.recommended,
      reactCompiler.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      testingLibrary.configs['flat/react'],
      prettier,
    ],
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {},
      },
      'import/internal-regex': '^~/',
    },
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: globals.browser,
    },
    plugins: {
      'unused-imports': unusedImports,
      'no-relative-import-paths': noRelativeImportPaths,
      react: reactPlugin,
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-relative-import-paths/no-relative-import-paths': 'error',
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules,
      ...jsxA11y.flatConfigs.strict.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'sibling', 'index', 'object', 'type'],
          alphabetize: { order: 'asc', caseInsensitive: false }, //グループ内でアルファベット順に並べるかを設定
          pathGroups: [
            {
              pattern: '{react,react-dom/**,react-router-dom,}',
              group: 'builtin',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
        },
      ],
    },
  },
  {
    files: ['app/**/*.ts', 'app/**/*.tsx'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': ['off'],
    },
  },
  {
    files: ['app/**/root.tsx'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': ['off'],
      'no-relative-import-paths/no-relative-import-paths': ['off'],
    },
  },
  {
    files: ['tests/**'], // or any other pattern
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.all.rules, // you can also use vitest.configs.all.rules to enable all rules
    },
  },
)
