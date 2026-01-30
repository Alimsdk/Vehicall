"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleUserService = exports.updateSingleUserService = exports.getAllUserService = void 0;
const db_1 = require("../../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAllUserService = async () => {
    const result = await db_1.pool.query(`SELECT * FROM users`);
    return result;
};
exports.getAllUserService = getAllUserService;
const updateSingleUserService = async (id, name, email, phone, role, password) => {
    let hashedPassword;
    if (password) {
        hashedPassword = await bcrypt_1.default.hash(password, 10);
    }
    const result = await db_1.pool.query(`UPDATE users SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      role = COALESCE($4, role),
      password = COALESCE($5, password)
    WHERE id = $6
    RETURNING *`, [name, email, phone, role, hashedPassword, id]);
    return result;
};
exports.updateSingleUserService = updateSingleUserService;
const deleteSingleUserService = async (id) => {
    console.log(id);
    const result = await db_1.pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    return result;
};
exports.deleteSingleUserService = deleteSingleUserService;
