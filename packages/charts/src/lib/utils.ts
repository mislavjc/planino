import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
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
