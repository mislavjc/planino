module.exports = {
  extends: ['next/core-web-vitals', 'plugin:tailwindcss/recommended'],
  plugins: ['eslint-plugin-react-compiler'],
  rules: {
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'react-compiler/react-compiler': 'error',
  },
};
