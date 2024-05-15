export const formatCurrency = (
  amount: number,
  currency: string = 'EUR',
): string => {
  return amount.toLocaleString('hr-HR', {
    style: 'currency',
    currency,
  });
};
