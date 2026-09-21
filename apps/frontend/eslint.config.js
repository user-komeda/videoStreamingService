import js from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import vitest from '@vitest/eslint-plugin'
import prettier from 'eslint-config-prettier'
import turboConfig from 'eslint-config-turbo/flat'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
import reactPlugin from 'eslint-plugin-react'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactHooks from 'eslint-plugin-react-hooks'
// eslint-disable-next-line import/no-named-as-default
import reactRefresh from 'eslint-plugin-react-refresh'
import testingLibrary from 'eslint-plugin-testing-library'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist',
      '.react-router/',
      'build/',
      'src/api/generated/**',
      'src/components/ui/**',
      'playwright-report/**',
    ],
  },
  {
    extends: [
      js.configs.recommended,
      // eslint-disable-next-line import/no-named-as-default-member
      ...tseslint.configs.recommendedTypeChecked,
      reactCompiler.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      ...turboConfig,
      ...pluginQuery.configs['flat/recommended'],
      testingLibrary.configs['flat/react'],
      prettier,
    ],
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: true,
      },
      'import/internal-regex': '^~/',
    },
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      ecmaVersion: 2020,
      parserOptions: {
        ...reactPlugin.configs.flat.recommended.languageOptions?.parserOptions,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
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
      // コード品質 & 複雑度
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      complexity: ['error', 10],
      'max-depth': ['error', 2],
      'max-params': ['error', 3],
      'max-lines': ['error', 115],
      'max-lines-per-function': ['error', 40],

      // TypeScript
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-vars': 'off',

      // パス関連
      'no-relative-import-paths/no-relative-import-paths': 'error',

      // React / JSX
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/self-closing-comp': 'error',
      'react/no-array-index-key': 'warn',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],

      // アクセシビリティ & Hooks
      ...jsxA11y.flatConfigs.strict.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // 未使用インポート
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

      // インポート順序
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'sibling',
            'index',
            'type',
          ],
          alphabetize: { order: 'asc', caseInsensitive: false },
          pathGroups: [
            {
              pattern: '{react,react-dom/**,react-router,react-router/**}',
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
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['app/**/root.tsx'],
    rules: {
      'no-relative-import-paths/no-relative-import-paths': 'off',
    },
  },
  {
    files: ['**/*.{test,spec}.{ts,tsx}', 'tests/**'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'max-lines-per-function': 'off',
      'max-lines': 'off',
    },
  },
  {
    files: ['e2e/**/*.{ts,tsx}'],
    rules: {
      'testing-library/prefer-screen-queries': 'off',
      'testing-library/no-node-access': 'off',
      'testing-library/prefer-presence-queries': 'off',
      'testing-library/await-async-queries': 'off',
      'testing-library/no-await-sync-queries': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    // eslint-disable-next-line import/no-named-as-default-member
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['*.config.{js,ts,mjs,cjs}', 'eslint.config.js'],
    rules: {
      'max-lines': 'off',
    },
  },
)
