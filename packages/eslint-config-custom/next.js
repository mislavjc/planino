module.exports = {
  extends: ['next/core-web-vitals', 'plugin:tailwindcss/recommended'],
  rules: {
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
};
