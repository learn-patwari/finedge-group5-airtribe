const ERROR_CODES = require("../constants/errorCodes");

class GenericError extends Error {
	/**
	 * @param {string} message
	 * @param {{
	 *  statusCode?: number,
	 *  code?: string,
	 *  details?: any,
	 *  cause?: any,
	 * }} [options]
	 */
	constructor(message = ERROR_CODES.INTERNAL_ERROR.message, options = {}) {
		super(message);

		const {
			statusCode = ERROR_CODES.INTERNAL_ERROR.statusCode,
			code = ERROR_CODES.INTERNAL_ERROR.code,
			details,
			cause,
		} = options;

		this.name = this.constructor.name;
		this.statusCode = statusCode;
		this.code = code;
		this.details = details;
		if (cause !== undefined) this.cause = cause;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	toJSON() {
		return {
			name: this.name,
			message: this.message,
			code: this.code,
			statusCode: this.statusCode,
			details: this.details,
		};
	}
}

module.exports = GenericError;
