import sharedConfig from '@planino/tailwind-config';
import type { Config } from 'tailwindcss';

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/@planino/**/*.{ts,tsx}',
  ],
  presets: [sharedConfig],
} satisfies Omit<Config, 'content'>;

export default config;
