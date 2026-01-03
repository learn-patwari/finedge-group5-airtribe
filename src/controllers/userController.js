require('dotenv').config();
const mongoose = require('mongoose');
const model = require('../models/user');
const bcrypt = require('bcrypt');
const {registerInputValidator,passwordCreator,loginInputValidator,generateTokenForUser} 
    = require('../services/userService');
const AuthenticationError = require('../errors/AuthenticationError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ERROR_CODES = require("../constants/errorCodes");
const UserDto = require('../dto/UserDto');


const registerUser = async (req,res) => {
    const user = req.body;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    
    const registerValidation = registerInputValidator(name, email, password);
    if (!registerValidation.isValid) {
        throw new BadRequestError(ERROR_CODES.BDRQ001, registerValidation.message);
    }
    user.password = passwordCreator(password);
    try {
        const dbUser = await model.create(user);
		return res.created('User registered', UserDto.detailed(dbUser));
    } catch (err) {
       throw new BadRequestError(ERROR_CODES.BDRQ001,`Failed to register user: ${err.message}`,'');
    }
};

const loginUser = async (req,res) => {
    const {email,password} = req.body;
    const loginValidation = loginInputValidator(email, password);
    if (!loginValidation.isValid) {
        throw new BadRequestError(ERROR_CODES.BDRQ001, loginValidation.message);
    }
    
    const queryString = {
        email: email
    };
    const dbUser = await model.findOne(queryString);
        
    if(!dbUser){
        throw new AuthenticationError(ERROR_CODES.AUTH004)
    }

    const paswdCheck = bcrypt.compareSync(password,dbUser.password);

    if(!paswdCheck){
        throw new AuthenticationError(ERROR_CODES.AUTH005);
    }
    const token = generateTokenForUser(dbUser);
	return res.success('Login successful', { token });
}

const getPreferences = async (req,res) => {
    const user = req.user;
    if(!user){
        throw new AuthenticationError(ERROR_CODES.AUTH004);
    }
	return res.success('Preferences', UserDto.preferences(user));
}

const getAllUsers = async (req, res) => {
    const users = await model.find({}, '-password');
    return res.success('Users', users.map((user) => UserDto.minimal(user)));
};

const getUserById = async (req, res) => {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
        throw new BadRequestError(ERROR_CODES.BDRQ002);
    }

    const user = await model.findById(userId, '-password');
    if (!user) {
        throw new NotFoundError(ERROR_CODES.NFER002);
    }

    return res.success('User', UserDto.detailed(user));
};

module.exports ={
    registerUser,
    loginUser,
    getPreferences,
	getAllUsers,
	getUserById,
    // updatePreferences
};
