/**
 * Calculate total income, expense and balance
 */
export function getSummary(transactions) {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expense,
    balance: income - expense
  };
}

/**
 * Group expenses by category
 */
export function getCategoryBreakdown(transactions) {
  return transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
}

/**
 * Monthly expense trend
 */
export function getMonthlyTrend(transactions) {
  const trend = {};

  transactions.forEach(t => {
    const month = new Date(t.date).toISOString().slice(0, 7);
    trend[month] = (trend[month] || 0) + t.amount;
  });

  return trend;
}

/**
 * Filter transactions
 */
export function filterTransactions(transactions, { type, category, from, to }) {
  return transactions.filter(t => {
    if (type && t.type !== type) return false;
    if (category && t.category !== category) return false;
    if (from && new Date(t.date) < new Date(from)) return false;
    if (to && new Date(t.date) > new Date(to)) return false;
    return true;
  });
}