require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'secret';
const tokenExpiry = process.env.JWT_EXPIRES_IN || '12h';

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password) => {
    return password && password.length >= 8;
};

const registerInputValidator = (name, email, password) => {
	if (!name) {
		return { isValid: false, message: 'Name is mandatory field' };
	}
	if (!password) {
		return { isValid: false, message: 'Password is mandatory field' };
	}
	if (!isValidPassword(password)) {
		return { isValid: false, message: 'Password must be at least 8 characters long' };
	}
	if (!email) {
		return { isValid: false, message: 'Email is mandatory field' };
	}
	if (!isValidEmail(email)) {
		return { isValid: false, message: 'Invalid email format' };
	}

	return { isValid: true };
};

const passwordCreator = (password) => {
    const saltRounds = parseInt(process.env.SALT_ROUNDS_FOR_PASSWORD, 10) || 10;
    return bcrypt.hashSync(
        password, saltRounds);
}
const loginInputValidator = (email,password) => {
    if (!email || !isValidEmail(email)) {
		return { isValid: false, message: 'Invalid email format' };
    }

    if (!password) {
		return { isValid: false, message: 'Password is required' };
    }

	return { isValid: true };
}

const generateTokenForUser =(user) => {
    const token = jwt.sign(
            {
                id:user._id,
                email:user.email,
                preferences:user.preferences
            },
            jwtSecret,
            {
                expiresIn:tokenExpiry
            }
        );
	return token;
}
module.exports = {
	registerInputValidator,
	passwordCreator,
	loginInputValidator,
	generateTokenForUser,
};
