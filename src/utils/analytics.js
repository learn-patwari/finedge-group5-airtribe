const Transaction = require("../models/transaction");

// Calculate total income, expenses, and balance
async function calculateTotals() {
  const income = await Transaction.aggregate([
    { $match: { type: "credit" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const expenses = await Transaction.aggregate([
    { $match: { type: "debit" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return {
    totalIncome: income[0]?.total || 0,
    totalExpenses: expenses[0]?.total || 0,
    balance: (income[0]?.total || 0) - (expenses[0]?.total || 0),
  };
}

// Filter transactions by category/date
async function filterTransactions({ category, startDate, endDate }) {
  const query = {};
  if (category) query.category = category;
  if (startDate || endDate) {
    query.occurredAt = {};
    if (startDate) query.occurredAt.$gte = new Date(startDate);
    if (endDate) query.occurredAt.$lte = new Date(endDate);
  }

  return await Transaction.find(query);
}

// Show monthly trends
async function getMonthlyTrends() {
  return await Transaction.aggregate([
    {
      $group: {
        _id: { month: { $month: "$occurredAt" }, year: { $year: "$occurredAt" } },
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] },
        },
        totalExpenses: {
          $sum: { $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0] },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
}

module.exports = {
  calculateTotals,
  filterTransactions,
  getMonthlyTrends,
};