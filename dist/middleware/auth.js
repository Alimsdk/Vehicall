"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
exports.runtime = "nodejs";
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            console.log(authHeader);
            if (!authHeader) {
                res.status(500).json({
                    success: false,
                    message: "you are not allowed"
                });
            }
            ;
            const token = authHeader.split(" ")[1];
            console.log(config_1.default.jwt_secret, token);
            if (!token)
                return res.status(401).json({ message: "No token" });
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
            req.user = decoded;
            console.log(req.user);
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }
            next();
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    };
};
exports.default = auth;
