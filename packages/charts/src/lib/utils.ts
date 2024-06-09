import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatCurrency = (value: number) => {
  const abbreviateNumber = (value: unknown) => {
    const num = parseFloat(value as string);

    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2) + 'B';
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(2) + 'k';
    }
    return num.toFixed(2);
  };

  const abbreviatedValue = abbreviateNumber(value);
  const numericPart = parseFloat(abbreviatedValue);

  const formattedValue = Intl.NumberFormat('hr-HR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPart);

  const suffix = abbreviatedValue.replace(/[\d.,]/g, '');

  const currencySymbol = '€';

  return `${formattedValue}${suffix} ${currencySymbol}`;
};
