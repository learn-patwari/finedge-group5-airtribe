const ERROR_CODES = require("../constants/errorCodes");

function globalErrorHandlerMiddleware(err, req, res, next) {
	// eslint-disable-next-line no-unused-vars
	if (res.headersSent) return next(err);

	const httpCode = Number(err?.httpCode) || ERROR_CODES.FIGE001.httpCode;

	const errorPayload = {
		name: err?.name || ERROR_CODES.FIGE001.statusCode,
		message: err?.message || ERROR_CODES.FIGE001.message,
		httpCode,
		statusCode: err?.statusCode || ERROR_CODES.FIGE001.statusCode,
		errorCode: err?.errorCode || ERROR_CODES.FIGE001.errorCode,
		details: err?.details,
	};

	return res.status(httpCode).json(errorPayload);
}

module.exports = globalErrorHandlerMiddleware;
