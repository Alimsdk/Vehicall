"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleUser = exports.updateSingleUser = exports.getAllUsers = void 0;
const user_service_1 = require("../user/user.service");
const booking_service_1 = require("../booking/booking.service");
const getAllUsers = async (req, res) => {
    try {
        const result = await (0, user_service_1.getAllUserService)();
        res.status(201).json({
            success: true,
            message: "User fetched Successfully",
            data: result.rows
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getAllUsers = getAllUsers;
const updateSingleUser = async (req, res) => {
    const { name, email, phone, role, password } = req.body;
    const id = req.params.userId;
    const decoded = req.user;
    if (!decoded) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (decoded.role === "user" && Number(decoded.id) !== Number(id)) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: You can only access your own data",
        });
    }
    try {
        const result = await (0, user_service_1.updateSingleUserService)(id, name, email, phone, role, password);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: result.rows[0],
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.updateSingleUser = updateSingleUser;
const deleteSingleUser = async (req, res) => {
    try {
        const bookingsByUser = await (0, booking_service_1.getBookingByUserIdService)(req.params.userId);
        if (bookingsByUser.rows.length !== 0) {
            res.status(409).json({
                success: false,
                message: "User cannot be deleted because they have existing bookings"
            });
        }
        const result = await (0, user_service_1.deleteSingleUserService)(req.params.userId);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: result.rows,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.deleteSingleUser = deleteSingleUser;
