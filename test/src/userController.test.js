process.env.DOTENV_CONFIG_QUIET = 'true';

const responseMiddleware = require('../../src/middlewares/responseMiddleware');

jest.mock('../../src/models/user', () => ({
	create: jest.fn(),
	findOne: jest.fn(),
	find: jest.fn(),
	findById: jest.fn(),
}));

jest.mock('../../src/services/userService', () => ({
	registerInputValidator: jest.fn(),
	passwordCreator: jest.fn(),
	loginInputValidator: jest.fn(),
	generateTokenForUser: jest.fn(),
}));

jest.mock('bcrypt', () => ({
	compareSync: jest.fn(),
}));

jest.mock('mongoose', () => ({
	isValidObjectId: jest.fn(),
}));

const model = require('../../src/models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const userService = require('../../src/services/userService');
const ERROR_CODES = require('../../src/constants/errorCodes');

const AuthenticationError = require('../../src/errors/AuthenticationError');
const BadRequestError = require('../../src/errors/BadRequestError');
const NotFoundError = require('../../src/errors/NotFoundError');

const userController = require('../../src/controllers/userController');

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

describe('userController', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('registerUser', () => {
		it('throws BadRequestError when input invalid', async () => {
			userService.registerInputValidator.mockReturnValue({
				isValid: false,
				message: 'Invalid input',
			});

			const req = { body: { name: '', email: 'bad', password: '' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(userController.registerUser(req, res)).rejects.toBeInstanceOf(
				BadRequestError
			);
			expect(model.create).not.toHaveBeenCalled();
		});

		it('creates user and responds 201 with GenericResponse', async () => {
			userService.registerInputValidator.mockReturnValue({ isValid: true });
			userService.passwordCreator.mockReturnValue('hashed');

			const dbUser = {
				_id: 'u1',
				name: 'A',
				email: 'a@example.com',
				preferences: { language: 'ENG' },
				defaultCurrency: 'INR',
			};
			model.create.mockResolvedValue(dbUser);

			const req = { body: { name: 'A', email: 'a@example.com', password: 'pw' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await userController.registerUser(req, res);

			expect(userService.passwordCreator).toHaveBeenCalledWith('pw');
			expect(model.create).toHaveBeenCalledWith({
				name: 'A',
				email: 'a@example.com',
				password: 'hashed',
			});
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'User registered',
					data: expect.objectContaining({
						id: 'u1',
						email: 'a@example.com',
						currency: 'INR',
					}),
				})
			);
		});

		it('wraps db create failures as BadRequestError', async () => {
			userService.registerInputValidator.mockReturnValue({ isValid: true });
			userService.passwordCreator.mockReturnValue('hashed');
			model.create.mockRejectedValue(new Error('db down'));

			const req = { body: { name: 'A', email: 'a@example.com', password: 'pw' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(userController.registerUser(req, res)).rejects.toBeInstanceOf(
				BadRequestError
			);
		});
	});

	describe('loginUser', () => {
		it('throws BadRequestError when input invalid', async () => {
			userService.loginInputValidator.mockReturnValue({
				isValid: false,
				message: 'Invalid input',
			});

			const req = { body: { email: 'bad', password: '' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(userController.loginUser(req, res)).rejects.toBeInstanceOf(
				BadRequestError
			);
		});

		it('throws AuthenticationError when user not found', async () => {
			userService.loginInputValidator.mockReturnValue({ isValid: true });
			model.findOne.mockResolvedValue(null);

			const req = { body: { email: 'a@example.com', password: 'pw' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(userController.loginUser(req, res)).rejects.toBeInstanceOf(
				AuthenticationError
			);
		});

		it('throws AuthenticationError when password mismatch', async () => {
			userService.loginInputValidator.mockReturnValue({ isValid: true });
			model.findOne.mockResolvedValue({ email: 'a@example.com', password: 'hashed' });
			bcrypt.compareSync.mockReturnValue(false);

			const req = { body: { email: 'a@example.com', password: 'pw' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(userController.loginUser(req, res)).rejects.toBeInstanceOf(
				AuthenticationError
			);
		});

		it('responds 200 with token on success', async () => {
			userService.loginInputValidator.mockReturnValue({ isValid: true });
			model.findOne.mockResolvedValue({ email: 'a@example.com', password: 'hashed' });
			bcrypt.compareSync.mockReturnValue(true);
			userService.generateTokenForUser.mockReturnValue('token123');

			const req = { body: { email: 'a@example.com', password: 'pw' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await userController.loginUser(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Login successful',
				data: { token: 'token123' },
			});
		});
	});

	describe('getPreferences', () => {
		it('throws AuthenticationError when req.user missing', async () => {
			const req = {};
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(userController.getPreferences(req, res)).rejects.toBeInstanceOf(
				AuthenticationError
			);
		});

		it('responds 200 with preferences DTO', async () => {
			const req = {
				user: { preferences: { language: 'ENG' }, defaultCurrency: 'INR' },
			};
			const res = createRes();
			attachResponseHelpers(req, res);

			await userController.getPreferences(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Preferences',
					data: { languagePreference: 'ENG', currency: 'INR' },
				})
			);
		});
	});

	describe('getAllUsers', () => {
		it('responds 200 with minimal users', async () => {
			model.find.mockResolvedValue([
				{ _id: '1', name: 'A', email: 'a@example.com', preferences: { language: 'ENG' } },
			]);

			const req = {};
			const res = createRes();
			attachResponseHelpers(req, res);

			await userController.getAllUsers(req, res);

			expect(model.find).toHaveBeenCalledWith({}, '-password');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Users',
					data: [
						expect.objectContaining({
							id: '1',
							email: 'a@example.com',
						}),
					],
				})
			);
		});
	});

	describe('getUserById', () => {
		it('throws BadRequestError when id invalid', async () => {
			mongoose.isValidObjectId.mockReturnValue(false);

			const req = { params: { userId: 'bad' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(userController.getUserById(req, res)).rejects.toBeInstanceOf(
				BadRequestError
			);
			expect(model.findById).not.toHaveBeenCalled();
		});

		it('throws NotFoundError when user not found', async () => {
			mongoose.isValidObjectId.mockReturnValue(true);
			model.findById.mockResolvedValue(null);

			const req = { params: { userId: '507f1f77bcf86cd799439011' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await expect(userController.getUserById(req, res)).rejects.toBeInstanceOf(
				NotFoundError
			);
		});

		it('responds 200 with detailed user on success', async () => {
			mongoose.isValidObjectId.mockReturnValue(true);
			model.findById.mockResolvedValue({
				_id: 'u1',
				name: 'A',
				email: 'a@example.com',
				preferences: { language: 'ENG' },
				defaultCurrency: 'INR',
			});

			const req = { params: { userId: '507f1f77bcf86cd799439011' } };
			const res = createRes();
			attachResponseHelpers(req, res);

			await userController.getUserById(req, res);

			expect(model.findById).toHaveBeenCalledWith(
				'507f1f77bcf86cd799439011',
				'-password'
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'User',
					data: expect.objectContaining({
						id: 'u1',
						email: 'a@example.com',
						currency: 'INR',
					}),
				})
			);
		});
	});
});
