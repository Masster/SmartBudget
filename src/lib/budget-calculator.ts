/**
 * Calculate budget period based on payday date.
 * Budget runs from payday to payday, not calendar months.
 */
export function getBudgetPeriod(paydayDate: number): { start: Date; end: Date } {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let start: Date;
  let end: Date;

  if (currentDay >= paydayDate) {
    // We're past this month's payday — period is this payday to next payday
    start = new Date(currentYear, currentMonth, paydayDate);
    const nextMonth = currentMonth + 1;
    end = new Date(currentYear, nextMonth, paydayDate - 1, 23, 59, 59, 999);
  } else {
    // We're before this month's payday — period is last month's payday to this payday
    const prevMonth = currentMonth - 1;
    start = new Date(currentYear, prevMonth, paydayDate);
    end = new Date(currentYear, currentMonth, paydayDate - 1, 23, 59, 59, 999);
  }

  return { start, end };
}

/**
 * Calculate budget limits from income and percentages.
 */
export function calculateLimits(
  totalIncome: number,
  needsPercent: number,
  wantsPercent: number,
  savingsPercent: number
) {
  return {
    needsLimit: Math.round((totalIncome * needsPercent) / 100),
    wantsLimit: Math.round((totalIncome * wantsPercent) / 100),
    savingsLimit: Math.round((totalIncome * savingsPercent) / 100),
  };
}

/**
 * Format currency amount for display.
 */
export function formatMoney(amount: number, currency = "RUB"): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
