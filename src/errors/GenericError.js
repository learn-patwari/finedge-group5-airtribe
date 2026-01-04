const ERROR_CODES = require("../constants/errorCodes");

class GenericError extends Error {
	constructor(errorCodeObj, message, details) {
		const fallback = ERROR_CODES.FIGE001;
		const resolved = errorCodeObj || fallback;

		const resolvedMessage =
			message ??
			resolved?.message ??
			fallback.message ;

		super(resolvedMessage);

		this.name = this.constructor.name;
		this.httpCode = Number(resolved?.httpCode) || fallback.httpCode;
		this.statusCode = resolved?.statusCode || fallback.statusCode;
		this.errorCode = resolved?.errorCode || resolved?.code || fallback.errorCode;
		this.details = details;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	// toJSON() {
	// 	return {
	// 		name: this.name,
	// 		message: this.message,
	// 		httpCode: this.httpCode,
	// 		statusCode: this.statusCode,
	// 		errorCode: this.errorCode,
	// 		details: this.details,
	// 	};
	// }
}

module.exports = GenericError;
