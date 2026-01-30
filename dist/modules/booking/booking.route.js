"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRouter = void 0;
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = (0, express_1.Router)();
exports.bookingRouter = router;
router.post("/", (0, auth_1.default)("user", "admin"), booking_controller_1.makeBooking);
router.get("/", (0, auth_1.default)("user", "admin"), booking_controller_1.getAllBookings);
router.put("/:bookingId", (0, auth_1.default)("user", "admin"), booking_controller_1.updateBookingInfo);
