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

type LoanForCalculation = {
  loanId: string;
  name: string | null;
  interestRate: string | null;
  duration: number | null;
  startingYear: number;
  endingYear: number;
  amount: string | null;
};

type YearlyPaymentData = {
  year: string;
  yearlyPPMT: string;
  yearlyIPMT: string;
  yearlyPMT: string;
};

export const getLoanPaymentData = (loans: LoanForCalculation[]) => {
  return loans.map((loan) => {
    const name = loan.name ?? 'Unknown Loan';
    const loanAmount = parseFloat(loan.amount ?? '0');
    const interestRate = parseFloat(loan.interestRate ?? '0') / 100 / 12;
    const loanDurationMonths = (loan.duration ?? 0) * 12;

    const yearlyData: YearlyPaymentData[] = [];

    for (let year = loan.startingYear; year <= loan.endingYear; year++) {
      let yearlyPPMT = 0;
      let yearlyIPMT = 0;
      let yearlyPMT = 0;

      for (let month = 1; month <= 12; month++) {
        const period = (year - loan.startingYear) * 12 + month;
        if (period <= loanDurationMonths) {
          yearlyPPMT += ppmt(
            interestRate,
            period,
            loanDurationMonths,
            -loanAmount,
          );
          yearlyIPMT += ipmt(
            interestRate,
            period,
            loanDurationMonths,
            -loanAmount,
          );
        }
      }

      yearlyPMT = yearlyPPMT + yearlyIPMT;
      yearlyData.push({
        year: year.toString(),
        yearlyPPMT: yearlyPPMT.toFixed(2),
        yearlyIPMT: yearlyIPMT.toFixed(2),
        yearlyPMT: yearlyPMT.toFixed(2),
      });
    }

    return {
      name,
      values: yearlyData,
    };
  });
};
