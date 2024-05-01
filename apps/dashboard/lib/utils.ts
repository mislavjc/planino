import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Converts a string to a slug by removing non-word characters, converting spaces to hyphens,
 * and trimming hyphens from the start and end.
 *
 * @param value - The string to be slugified.
 * @returns The slugified string.
 */
export const slugify = (value: string) => {
  return (
    value
      // Convert string to lowercaseÌ
      .toLowerCase()
      // Replace spaces with hyphens
      .replace(/\s+/g, '-')
      // Remove all non-word chars (keeping only letters, numbers, and hyphens)
      .replace(/[^\w\-]+/g, '')
      // Replace multiple hyphens with a single hyphen
      .replace(/\-\-+/g, '-')
      // Trim hyphens from the start
      .replace(/^-+/, '')
      // Trim hyphens from the end
      .replace(/-+$/, '')
  );
};

export const formatCurrency = (
  amount: number,
  currency: string = 'EUR',
): string => {
  return amount.toLocaleString('hr-HR', {
    style: 'currency',
    currency,
  });
};

export const predefinedColors = [
  'hsla(0, 100%, 70%, 0.15)', // Red Pink
  'hsla(30, 100%, 75%, 0.15)', // Peach
  'hsla(60, 100%, 85%, 0.15)', // Pale Yellow
  'hsla(90, 100%, 80%, 0.15)', // Tea Green
  'hsla(180, 100%, 75%, 0.15)', // Baby Blue
  'hsla(210, 100%, 80%, 0.15)', // Blue Mauve
  'hsla(270, 100%, 80%, 0.15)', // Mauve
  'hsla(300, 100%, 80%, 0.15)', // Pink
  'hsla(60, 100%, 95%, 0.15)', // Ivory
  'hsla(150, 60%, 75%, 0.15)', // Eton Blue
];

/**
 * Generates a random color based on the given text and optional opacity.
 * @param text - The input text.
 * @param opacity - Optional opacity value to apply to the color.
 * @returns A random color with adjusted opacity.
 */
export const getRandomColor = (text: string, opacity?: number) => {
  const hash = text
    .split('')
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);

  const index = Math.abs(hash) % predefinedColors.length;
  let color = predefinedColors[index];

  if (typeof opacity === 'number') {
    color = color.replace(/[\d.]+(?=\))/, opacity.toString());
  }

  return color;
};
