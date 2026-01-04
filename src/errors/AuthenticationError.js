const GenericError = require('./GenericError');
const ERROR_CODES = require('../constants/errorCodes');

class AuthenticationError extends GenericError {
	constructor(errorCodeObj, message, details) {
		super(errorCodeObj || ERROR_CODES.AUTH001, message, details);
		this.httpCode = ERROR_CODES.AUTH001.httpCode || 401;
		this.statusCode = ERROR_CODES.AUTH001.statusCode;
		if (!this.errorCode) this.errorCode = ERROR_CODES.AUTH001.errorCode;
		if (!this.message) this.message = errorCodeObj?.message || ERROR_CODES.AUTH001.message;
	}
}

module.exports = AuthenticationError;
