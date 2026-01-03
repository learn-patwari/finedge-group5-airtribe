const Transaction = require("../models/transaction");

// Suggest saving tips or budgets based on past spending
async function suggestSavings() {
  const expenses = await Transaction.aggregate([
    { $match: { type: "debit" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const averageExpenses = (expenses[0]?.total || 0) / 12; // Assuming 12 months of data
  const suggestedSavings = averageExpenses * 0.2; // Suggest saving 20% of average expenses

  return {
    averageExpenses,
    suggestedSavings,
    message: `Based on your spending, we suggest saving at least Rs. ${suggestedSavings.toFixed(
      2
    )} per month.`,
  };
}

// Auto-categorize expenses using keyword matching
function autoCategorize(transaction) {
  const categoryKeywords = {
    groceries: ["grocery", "supermarket", "food"],
    rent: ["rent", "apartment", "housing"],
    entertainment: ["movie", "concert", "entertainment"],
    // Add more categories and keywords as needed
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => transaction.description?.toLowerCase().includes(keyword))) {
      return category;
    }
  }

  return "other"; // Default category
}

// Real-time updates on new transactions
function notifyNewTransaction(transaction) {
  console.log("New transaction added:", transaction);
}

module.exports = {
  suggestSavings,
  autoCategorize,
  notifyNewTransaction,
};