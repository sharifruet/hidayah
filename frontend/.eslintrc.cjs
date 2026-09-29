/**
 * ESLint 8 (legacy config) for the Vite + React SPA. `npm run lint` allows zero warnings.
 */
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  settings: { react: { version: '18.2' } },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['react-refresh'],
  ignorePatterns: ['dist', 'node_modules', 'coverage', 'playwright-report', 'test-results'],
  rules: {
    // Props are documented in JSDoc/comments; the app has no PropTypes.
    'react/prop-types': 'off',
    // Context modules export their provider plus the hook that reads it.
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true, allowExportNames: ['useApp', 'useAppLocale', 'useAdmin'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
    // `catch {}` around localStorage access is intentional (private mode / quota).
    'no-empty': ['error', { allowEmptyCatch: true }],
  },
  overrides: [
    {
      files: ['src/tests/**', '**/*.test.{js,jsx}'],
      env: { node: true },
      globals: { vi: 'readonly', describe: 'readonly', it: 'readonly', test: 'readonly', expect: 'readonly', beforeEach: 'readonly', afterEach: 'readonly', beforeAll: 'readonly', afterAll: 'readonly' },
      rules: { 'react-refresh/only-export-components': 'off' },
    },
    { files: ['e2e/**', '*.config.{js,cjs}', '.eslintrc.cjs'], env: { node: true } },
    { files: ['public/sw.js'], env: { browser: false, serviceworker: true } },
  ],
};
