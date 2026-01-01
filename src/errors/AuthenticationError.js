const GenericError = require('./GenericError');
const ERROR_CODES = require('../constants/errorCodes');

class AuthenticationError extends GenericError {
	/**
	 * @param {{
	 *  errorCode?: { code: string, message: string, statusCode: number },
	 *  message?: string,
	 *  details?: any,
	 *  cause?: any
	 * }} [options]
	 */
	constructor(options = {}) {
		const { errorCode = ERROR_CODES.AUTH001, message, details, cause } = options;
		super(message || errorCode.message, {
			statusCode: errorCode.statusCode,
			code: errorCode.code,
			details,
			cause,
		});
	}
}

module.exports = AuthenticationError;