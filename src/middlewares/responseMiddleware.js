const GenericResponse = require('../dto/GenericResponse');

function responseMiddleware(req, res, next) {
	res.success = (message = 'Success', data = null) => {
		return res.status(200).json(GenericResponse.success(message, data));
	};

	res.created = (message = 'Created', data = null) => {
		return res.status(201).json(GenericResponse.success(message, data));
	};

	res.noContent = () => {
		return res.status(204).send();
	};

	return next();
}

module.exports = responseMiddleware;
