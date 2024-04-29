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
