"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = (0, express_1.Router)();
exports.userRouter = router;
router.get("/", (0, auth_1.default)("admin"), user_controller_1.getAllUsers);
router.put("/:userId", (0, auth_1.default)("user", "admin"), user_controller_1.updateSingleUser);
router.delete("/:userId", (0, auth_1.default)("admin"), user_controller_1.deleteSingleUser);
