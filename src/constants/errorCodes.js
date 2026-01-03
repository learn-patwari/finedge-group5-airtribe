const ERROR_CODES = Object.freeze({
	//Authentication Errors
	AUTH001: {errorCode: 'AUTH001',statusCode : 'FinEdge Authentication Error', httpCode: 401,message: 'Authentication failed'},
	AUTH002: {errorCode: 'AUTH002',message: 'Invalid credentials'},
	AUTH003: {errorCode: 'AUTH003',message: 'Access token missing or invalid'},
	AUTH004: {errorCode: 'AUTH004',message: 'Invalid User'},
	AUTH005: {errorCode: 'AUTH005',message: 'Username/Password is incorrect'},
	//Generic Error
	FIGE001:{errorCode:'FIGE001' ,statusCode : 'FinEdge Server Error', httpCode: 500,message : 'Oops!! Something went wrong, Try again after sometime'},
	// Bad Request Errors
	BDRQ001:{errorCode:'BDRQ001', statusCode: 'FinEdge Bad Request', httpCode: 400, message : 'Invalid Input'},
	BDRQ002:{errorCode:'BDRQ002',  message : 'Invalid User Id Or User Not Found'},
	// NotFound Errors
	NFER001:{errorCode:'NFER001', statusCode: 'FinEdge Not Found', httpCode: 404, message: 'Resource Not Found'},
	NFER002:{errorCode:'NFER002', message: 'User Not Found'},
});

module.exports = ERROR_CODES;
