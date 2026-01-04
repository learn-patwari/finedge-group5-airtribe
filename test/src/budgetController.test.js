process.env.DOTENV_CONFIG_QUIET = 'true';

const responseMiddleware = require('../../src/middlewares/responseMiddleware');

jest.mock('../../src/services/budgetService', () => ({
	createBudget: jest.fn(),
	getBudgetByIdForUser: jest.fn(),
	getAllBudgetsForUser: jest.fn(),
}));

jest.mock('mongoose', () => ({
	isValidObjectId: jest.fn(),
}));

const budgetService = require('../../src/services/budgetService');
const mongoose = require('mongoose');

const BadRequestError = require('../../src/errors/BadRequestError');
const NotFoundError = require('../../src/errors/NotFoundError');

const budgetController = require('../../src/controllers/budgetController');

function createRes() {
	return {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
		send: jest.fn(),
	};
}

function attachResponseHelpers(req, res) {
	responseMiddleware(req, res, () => {});
}

describe('budgetController', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('createBudget', () => {
		it('throws BadRequestError when authenticated user missing', async () => {
			const req = { body: { year: 2026, month: 1 } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(budgetController.createBudget(req, res)).rejects.toBeInstanceOf(
				BadRequestError
			);
			expect(budgetService.createBudget).not.toHaveBeenCalled();
		});

		it('throws BadRequestError when year/month missing', async () => {
			const req = { user: { id: 'u1' }, body: { year: 2026 } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(budgetController.createBudget(req, res)).rejects.toBeInstanceOf(
				BadRequestError
			);
			expect(budgetService.createBudget).not.toHaveBeenCalled();
		});

		it('creates budget and responds 201', async () => {
			budgetService.createBudget.mockResolvedValue({ id: 'b1' });

			const req = {
				user: { id: 'u1' },
				body: {
					year: '2026',
					month: '1',
					currency: 'INR',
					incomeGoal: 10000,
					savingsTarget: 2000,
					spendingLimit: 8000,
					notes: 'n',
					status: 'active',
					metadata: { a: 1 },
				},
			};
			const res = createRes();
			attachResponseHelpers(req, res);

			await budgetController.createBudget(req, res);

			expect(budgetService.createBudget).toHaveBeenCalledWith(
				expect.objectContaining({
					userId: 'u1',
					year: 2026,
					month: 1,
					currency: 'INR',
					incomeGoal: 10000,
					savingsTarget: 2000,
					spendingLimit: 8000,
					notes: 'n',
					status: 'active',
					metadata: { a: 1 },
				})
			);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Budget created',
				data: { id: 'b1' },
			});
		});

		it('maps duplicate key error (11000) to BadRequestError', async () => {
			budgetService.createBudget.mockRejectedValue({ code: 11000 });

			const req = { user: { id: 'u1' }, body: { year: 2026, month: 1 } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(budgetController.createBudget(req, res)).rejects.toBeInstanceOf(
				BadRequestError
			);
		});
	});

	describe('getBudget', () => {
		it('throws BadRequestError when authenticated user missing', async () => {
			const req = { params: { id: 'b1' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(budgetController.getBudget(req, res)).rejects.toBeInstanceOf(
				BadRequestError
			);
		});

		it('throws BadRequestError when budget id invalid', async () => {
			mongoose.isValidObjectId.mockReturnValue(false);

			const req = { user: { id: 'u1' }, params: { id: 'bad' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(budgetController.getBudget(req, res)).rejects.toBeInstanceOf(
				BadRequestError
			);
			expect(budgetService.getBudgetByIdForUser).not.toHaveBeenCalled();
		});

		it('throws NotFoundError when budget not found', async () => {
			mongoose.isValidObjectId.mockReturnValue(true);
			budgetService.getBudgetByIdForUser.mockResolvedValue(null);

			const req = { user: { id: 'u1' }, params: { id: '507f1f77bcf86cd799439011' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(budgetController.getBudget(req, res)).rejects.toBeInstanceOf(
				NotFoundError
			);
		});

		it('responds 200 with budget on success', async () => {
			mongoose.isValidObjectId.mockReturnValue(true);
			budgetService.getBudgetByIdForUser.mockResolvedValue({ id: 'b1' });

			const req = { user: { id: 'u1' }, params: { id: '507f1f77bcf86cd799439011' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await budgetController.getBudget(req, res);

			expect(budgetService.getBudgetByIdForUser).toHaveBeenCalledWith(
				'507f1f77bcf86cd799439011',
				'u1'
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Budget',
				data: { id: 'b1' },
			});
		});
	});

	describe('getAllBudgets', () => {
		it('throws BadRequestError when authenticated user missing', async () => {
			const req = { query: {} };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(budgetController.getAllBudgets(req, res)).rejects.toBeInstanceOf(
				BadRequestError
			);
		});

		it('responds 200 with budgets and passes filters', async () => {
			budgetService.getAllBudgetsForUser.mockResolvedValue([{ id: 'b1' }]);

			const req = {
				user: { id: 'u1' },
				query: { year: '2026', month: '1', status: 'active' },
			};
			const res = createRes();
			attachResponseHelpers(req, res);

			await budgetController.getAllBudgets(req, res);

			expect(budgetService.getAllBudgetsForUser).toHaveBeenCalledWith('u1', {
				year: 2026,
				month: 1,
				status: 'active',
			});
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Budgets',
				data: [{ id: 'b1' }],
			});
		});
	});
});
