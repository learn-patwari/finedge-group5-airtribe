const Budget = require('../models/budget');

async function createBudget(data) {
	return Budget.create(data);
}

async function getBudgetByIdForUser(budgetId, userId) {
	return Budget.findOne({ _id: budgetId, userId });
}

async function getAllBudgetsForUser(userId, filters = {}) {
	const query = { userId };

	if (filters.year !== undefined) query.year = filters.year;
	if (filters.month !== undefined) query.month = filters.month;
	if (filters.status !== undefined) query.status = filters.status;

	return Budget.find(query).sort({ year: -1, month: -1, createdAt: -1 });
}

module.exports = {
	createBudget,
	getBudgetByIdForUser,
	getAllBudgetsForUser,
};
