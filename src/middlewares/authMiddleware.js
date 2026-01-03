const jwt = require("jsonwebtoken");
const ERROR_CODES = require("../constants/errorCodes");
const AuthenticationError = require("../errors/AuthenticationError");

const validateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    let token = authHeader;

    // Support both "Bearer <token>" and raw token
    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7).trim();
    }

    if (!token) {
        throw new AuthenticationError(ERROR_CODES.AUTH003);
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        return next();
    } catch (err) {
        throw new AuthenticationError(ERROR_CODES.AUTH003);
    }
};

module.exports = validateJwt;
