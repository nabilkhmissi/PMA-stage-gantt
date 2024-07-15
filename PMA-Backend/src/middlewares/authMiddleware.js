const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");

const authMiddleware = asyncHandler(async(req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, "secret_this_should_be_longer");

            // Get user from the token
            req.user = await User.findById(decoded.id);
            res.locals.user = req.user;
            next();
        } catch (error) {
            console.log('Not authorized')
            return res.status(401).send({ message : "You are not authorized to perform this action" });
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = { authMiddleware };