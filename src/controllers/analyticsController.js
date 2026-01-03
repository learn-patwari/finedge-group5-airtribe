const analytics = require("../utils/analytics");

async function filterTransactions(req, res, next) {
  try {
    const { category, startDate, endDate } = req.query;
    const transactions = await analytics.filterTransactions({ category, startDate, endDate });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
}

async function calculateTotals(req, res, next) {
  try {
    const transactions = await analytics.calculateTotals();
    res.json(transactions);
  } catch (err) {
    next(err);
  }
}

async function getMonthlyTrends(req, res, next) {
  try {
    const transactions = await analytics.getMonthlyTrends();
    res.json(transactions);
  } catch (err) {
    next(err);
  }
}

module.exports = {
    filterTransactions,
    calculateTotals,
    getMonthlyTrends
};