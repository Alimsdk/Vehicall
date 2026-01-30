"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingInfo = exports.getAllBookings = exports.makeBooking = void 0;
const booking_service_1 = require("./booking.service");
const vehicle_service_1 = require("../vehicle/vehicle.service");
const db_1 = require("../../config/db");
const node_cron_1 = __importDefault(require("node-cron"));
const makeBooking = async (req, res) => {
    try {
        const result = await (0, booking_service_1.makeBookingService)(req.body);
        console.log("hihihi", result);
        if (!result || result.rows.length === 0) {
            return res.status(500).json({
                success: false,
                message: "Make booking failed",
            });
        }
        // change vehicle status to booked after booking confirmation
        await (0, vehicle_service_1.updateSingleVehicleService)({ id: result.rows[0]?.vehicle_id, availability_status: "booked" });
        res.status(201).json({
            success: true,
            message: "booking added successfully",
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
exports.makeBooking = makeBooking;
const getAllBookings = async (req, res) => {
    console.log(req.user);
    const { id, role } = req.user;
    let result;
    try {
        if (role === "admin") {
            result = await (0, booking_service_1.getAllBookingService)();
        }
        else {
            result = await (0, booking_service_1.getBookingByUserIdService)(id);
        }
        res.status(200).json({
            success: true,
            message: "bookings fetched successfully",
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
exports.getAllBookings = getAllBookings;
const updateBookingInfo = async (req, res) => {
    const { bookingId } = req.params;
    const { id: userId } = req.user;
    const { role: userRole } = req.user;
    const { status } = req.body;
    try {
        // 1. Fetch the booking
        const result = await db_1.pool.query("SELECT * FROM bookings WHERE id = $1", [bookingId]);
        const booking = result.rows[0];
        if (!booking)
            return res.status(404).json({
                sucess: false,
                message: "Booking not found"
            });
        const now = new Date();
        // CUSTOMER: Cancel booking before start date
        if (userRole === "customer") {
            if (booking.user_id !== userId)
                return res.status(403).json({ success: false, message: "Forbidden" });
            if (status === "cancel") {
                if (new Date(booking.start_date) <= now)
                    return res
                        .status(400)
                        .json({ message: "Cannot cancel after start date" });
                await db_1.pool.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1", [bookingId]);
                // Update vehicle availability
                await db_1.pool.query("UPDATE vehicles SET availability_status = 'available' WHERE id = $1", [booking.vehicle_id]);
                return res.json({ message: "Booking cancelled successfully" });
            }
            return res.status(400).json({ message: "Invalid action for customer" });
        }
        // ADMIN: Mark as returned
        if (userRole === "admin") {
            if (status === "return") {
                await db_1.pool.query("UPDATE bookings SET status = 'returned' WHERE id = $1", [bookingId]);
                await db_1.pool.query("UPDATE vehicles SET availability_status = 'available' WHERE id = $1", [booking.vehicle_id]);
                return res.json({ message: "Booking marked as returned" });
            }
            return res.status(400).json({ success: false, message: "Invalid action for admin" });
        }
        //  SYSTEM:
        node_cron_1.default.schedule("0 0 * * *", async () => {
            const now = new Date();
            const result = await db_1.pool.query("SELECT * FROM bookings WHERE status != 'returned' AND end_date < $1", [now]);
            for (const booking of result.rows) {
                await db_1.pool.query("UPDATE bookings SET status = 'returned' WHERE id = $1", [booking.id]);
                await db_1.pool.query("UPDATE vehicles SET availability_status = 'available' WHERE id = $1", [booking.vehicle_id]);
                console.log(`Auto-returned booking ${booking.id}`);
            }
        });
        return res.status(403).json({ success: false, message: "Action not allowed" });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.updateBookingInfo = updateBookingInfo;
