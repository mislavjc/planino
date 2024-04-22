module.exports = {
  extends: ['next/core-web-vitals', 'plugin:tailwindcss/recommended'],
  plugins: ['simple-import-sort', 'prettier'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'prettier/prettier': 'error',
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Packages `react` related packages come first.
              ['^react', '^@?\\w'],
              // Database
              ['^(|db)(/.*|$)'],
              // Server actions
              ['^(|actions)(/.*|$)'],
              // UI components
              ['^(|ui)(/.*|$)'],
              // Internal packages.
              ['^(|components)(/.*|$)'],
              // hooks
              ['^(|hooks)(/.*|$)'],
              // Lib
              ['^(|lib)(/.*|$)'],
              // Types
              ['^(|types)(/.*|$)'],
              // Public files
              ['^(|public)(/.*|$)'],
              // Side effect imports.
              ['^\\u0000'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // Style imports.
              ['^.+\\.?(css)$'],
            ],
          },
        ],
      },
    },
  ],
};
