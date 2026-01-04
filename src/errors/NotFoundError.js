const GenericError = require('./GenericError');
const ERROR_CODES = require('../constants/errorCodes');

class NotFoundError extends GenericError {
	constructor(errorCodeObj, message, details) {
		super(errorCodeObj || ERROR_CODES.NFER001, message, details);
		this.httpCode = ERROR_CODES.NFER001.httpCode || 404;
		this.statusCode = ERROR_CODES.NFER001.statusCode;
		if (!this.errorCode) this.errorCode = ERROR_CODES.NFER001.errorCode;
		if (!this.message) this.message = errorCodeObj?.message || ERROR_CODES.NFER001.message;
	}
}

module.exports = NotFoundError;
