"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const auth_service_1 = require("./auth.service");
const createUser = async (req, res) => {
    try {
        const result = await (0, auth_service_1.createUserService)(req.body);
        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: result.rows[0]
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }
    try {
        const result = await (0, auth_service_1.signInService)(email, password);
        if (!result) {
            res.status(500).json({
                success: false,
                message: "login failed"
            });
        }
        res.status(201).json({
            success: true,
            message: "Signed In Successfully",
            data: result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.loginUser = loginUser;
