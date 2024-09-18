
const jwt=require("jsonwebtoken");
const { User } = require("../models/user");

const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    console.log(token,'TOKEN')

    if (!token) {
        console.log("No token found");
        return res.status(404).json({
            success: false,
            message: "Login First",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        req.user = await User.findById(decoded._id);
        console.log("Authenticated user:", req.user);

        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

module.exports={isAuthenticated}