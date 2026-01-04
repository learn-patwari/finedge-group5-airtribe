class GenericResponse {
	static success(message = 'Success', data = null) {
		return {
			success: true,
			message,
			data,
		};
	}

	static failure(error) {
		return {
			success: false,
			error,
		};
	}
}

module.exports = GenericResponse;

