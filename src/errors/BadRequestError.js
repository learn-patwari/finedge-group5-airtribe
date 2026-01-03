const GenericError = require('./GenericError');
const ERROR_CODES = require('../constants/errorCodes');

class BadRequestError extends GenericError {
	constructor(errorCodeObj, message, details) {
		super(errorCodeObj || ERROR_CODES.BDRQ001, message, details);
		this.httpCode = ERROR_CODES.BDRQ001.httpCode || 400;
		this.statusCode = ERROR_CODES.BDRQ001.statusCode;
		if (!this.errorCode) this.errorCode = ERROR_CODES.BDRQ001.errorCode;
		if (!this.message) this.message = errorCodeObj?.message || ERROR_CODES.BDRQ001.message;
	}
}

module.exports = BadRequestError;
