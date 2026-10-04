import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // The "useX" hook + "XProvider" co-export is the established pattern in
      // this repo's contexts; keep it as a non-blocking hint, not an error.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // We intentionally drive mount/exit animation timing and storage
      // hydration from effects (guarded + via rAF/timeout). Don't error on it.
      'react-hooks/set-state-in-effect': 'off',
      // Allow unused catch bindings (catch (err) {}) and intentional
      // omit-via-rest destructuring; underscore-prefixed names are opt-out.
      'no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
])
