require('dotenv').config();

const mongoose = require('mongoose');
const budgetService = require('../services/budgetService');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ERROR_CODES = require('../constants/errorCodes');

async function createBudget(req, res) {
	const authUserId = req.user?.id;
	if (!authUserId) {
		throw new BadRequestError(ERROR_CODES.BDRQ001, 'Missing authenticated user');
	}

	
	  

	const {
		year,
		month,
		currency,
		incomeGoal,
		savingsTarget,
		spendingLimit,
		notes,
		status,
		metadata,
	} = req.body || {};

	if (year === undefined || month === undefined) {
		throw new BadRequestError(ERROR_CODES.BDRQ001, 'year and month are required');
	}

	if (year < 2000 || year > 3000 || month < 1 || month > 12) {
		throw new BadRequestError(
		  ERROR_CODES.BDRQ001,
		  'Invalid year or month'
		);
	  }
	const budgetPayload = {
		userId: authUserId,
		year: Number(year),
		month: Number(month),
		currency,
		incomeGoal,
		savingsTarget,
		spendingLimit,
		notes,
		status,
		metadata,
	};

	try {
		const created = await budgetService.createBudget(budgetPayload);
		return res.created('Budget created', created);
	} catch (err) {
		// Unique index: userId+year+month
		if (err?.code === 11000) {
			throw new BadRequestError(
				ERROR_CODES.BDRQ001,
				'Budget already exists for this user/month'
			);
		}
		throw err;
	}
	
}

async function getBudget(req, res) {
	const authUserId = req.user?.id;
	if (!authUserId) {
		throw new BadRequestError(ERROR_CODES.BDRQ001, 'Missing authenticated user');
	}

	const budgetId = req.params.id;
	if (!mongoose.isValidObjectId(budgetId)) {
		throw new BadRequestError(ERROR_CODES.BDRQ001, 'Invalid budget id');
	}

	const budget = await budgetService.getBudgetByIdForUser(budgetId, authUserId);
	if (!budget) {
		throw new NotFoundError(ERROR_CODES.NFER001, 'Budget not found');
	}

	return res.success('Budget', budget);
}

async function getAllBudgets(req, res) {
	const authUserId = req.user?.id;
	if (!authUserId) {
		throw new BadRequestError(ERROR_CODES.BDRQ001, 'Missing authenticated user');
	}

	const filters = {};
	if (req.query?.year !== undefined) filters.year = Number(req.query.year);
	if (req.query?.month !== undefined) filters.month = Number(req.query.month);
	if (req.query?.status !== undefined) filters.status = req.query.status;

	const budgets = await budgetService.getAllBudgetsForUser(authUserId, filters);
	return res.success('Budgets', budgets);
}

module.exports = {
	createBudget,
	getBudget,
	getAllBudgets,
};