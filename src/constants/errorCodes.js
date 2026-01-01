const ERROR_CODES = Object.freeze({
	AUTH001: {
		code: 'AUTH001',
		message: 'Authentication failed',
		statusCode: 401,
	},
	AUTH002: {
		code: 'AUTH002',
		message: 'Invalid credentials',
		statusCode: 401,
	},
	AUTH003: {
		code: 'AUTH003',
		message: 'Access token missing or invalid',
		statusCode: 401,
	},
	INTERNAL_ERROR: {
		code: 'INTERNAL_ERROR',
		message: 'Oops!!Something went wrong, Try again after sometime',
		statusCode: 500,
	},
	BAD_REQUEST: {
		code: 'BAD_REQUEST',
		message: 'Invalid request',
		statusCode: 400,
	},
	UNAUTHORIZED: {
		code: 'UNAUTHORIZED',
		message: 'Unauthorized',
		statusCode: 401,
	},
	FORBIDDEN: {
		code: 'FORBIDDEN',
		message: 'Forbidden',
		statusCode: 403,
	},
	NOT_FOUND: {
		code: 'NOT_FOUND',
		message: 'Resource not found',
		statusCode: 404,
	},
	CONFLICT: {
		code: 'CONFLICT',
		message: 'Conflict',
		statusCode: 409,
	},
	TOO_MANY_REQUESTS: {
		code: 'TOO_MANY_REQUESTS',
		message: 'Too many requests',
		statusCode: 429,
	},
});

module.exports = ERROR_CODES;
