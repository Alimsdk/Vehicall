"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInService = exports.createUserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../config/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const createUserService = async (payload) => {
    const { name, email, phone, role, password } = payload;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const result = await db_1.pool.query(`INSERT INTO users(name,email,phone,role,password) VALUES($1,LOWER($2),$3, COALESCE($4, 'user'),$5) RETURNING *`, [name, email, phone, role, hashedPassword]);
    return result;
};
exports.createUserService = createUserService;
const signInService = async (email, password) => {
    const result = await db_1.pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
        return null;
    }
    const user = result.rows[0];
    const isPasswordMatched = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatched) {
        return null;
    }
    if (!config_1.default.jwt_secret) {
        return null;
    }
    console.log(config_1.default.jwt_secret);
    const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, config_1.default.jwt_secret, {
        expiresIn: "7d"
    });
    return { token, user };
};
exports.signInService = signInService;
