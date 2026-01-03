const express = require('express');
const userRouter = express.Router();
const { registerUser, loginUser, getPreferences, getAllUsers, getUserById } 
    = require('../controllers/userController');
const validateJwt = require('../middlewares/authMiddleware');

userRouter.post('/', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/preferences', validateJwt, getPreferences);
userRouter.get('/:userId', validateJwt, getUserById);
userRouter.get('/', validateJwt, getAllUsers);
// userRouter.put('/preferences', validateJwt,updatePreferences);

module.exports = userRouter;
