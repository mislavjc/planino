import { ipmt, pmt, ppmt } from 'financial';

import { formatCurrency } from './utils';

type PaymentCalculations = {
  yearlyPPMT: number;
  yearlyIPMT: number;
  yearlyPMT: number;
};

export const calculatePayments = (
  loan: {
    interestRate: string;
    duration: number;
    amount: number;
    startingYear: number;
  },
  currentYear: number,
): PaymentCalculations => {
  const loanDurationMonths = loan.duration * 12;
  const loanInterestRateMonthly = parseFloat(loan.interestRate) / 100 / 12;
  const loanAmount = -loan.amount;

  const monthlyPMT = pmt(
    loanInterestRateMonthly,
    loanDurationMonths,
    loanAmount,
  );
  const yearlyPMT = monthlyPMT * 12;

  let yearlyPPMT = 0;
  let yearlyIPMT = 0;

  for (let month = 1; month <= 12; month++) {
    const period = (currentYear - loan.startingYear) * 12 + month;
    if (period <= loanDurationMonths) {
      yearlyPPMT += ppmt(
        loanInterestRateMonthly,
        period,
        loanDurationMonths,
        loanAmount,
      );
      yearlyIPMT += ipmt(
        loanInterestRateMonthly,
        period,
        loanDurationMonths,
        loanAmount,
      );
    }
  }

  return { yearlyPPMT, yearlyIPMT, yearlyPMT };
};

export const renderYearlyData = (
  loan: { startingYear: number; endingYear: number },
  years: number[],
  calculatePayments: (_loan: any, _year: number) => PaymentCalculations,
): JSX.Element[] => {
  return years.map((year) => {
    if (year < loan.startingYear || year > loan.endingYear) {
      return (
        <td
          key={year}
          className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
        >
          -
        </td>
      );
    }

    const { yearlyPPMT, yearlyIPMT, yearlyPMT } = calculatePayments(loan, year);

    return (
      <td
        key={year}
        className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
      >
        <div>PMT: {formatCurrency(yearlyPMT)}</div>
        <div>PPMT: {formatCurrency(yearlyPPMT)}</div>
        <div>IPMT: {formatCurrency(yearlyIPMT)}</div>
      </td>
    );
  });
};
