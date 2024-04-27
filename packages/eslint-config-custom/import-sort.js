module.exports = {
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
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
              // APi
              ['^(|api)(/.*|$)'],
              // Utils
              ['^(|utils)(/.*|$)'],
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
