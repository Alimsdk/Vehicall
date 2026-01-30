"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingByVehicleIdService = exports.getBookingByUserIdService = exports.getAllBookingService = exports.makeBookingService = void 0;
const db_1 = require("../../config/db");
const vehicle_service_1 = require("../vehicle/vehicle.service");
const makeBookingService = async (payload) => {
    const { user_id, vehicle_id, rent_start_date, rent_end_date, status } = payload;
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const rentedDays = Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY);
    const res = await (0, vehicle_service_1.getSingleVehicleService)(vehicle_id);
    const { daily_rent_price } = res.rows[0];
    if (res.rows.length === 0 || !rentedDays || !daily_rent_price) {
        return null;
    }
    if (start.getTime() >= end.getTime()) {
        return null;
    }
    const totalPrice = Number(daily_rent_price * rentedDays);
    console.log(user_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, status);
    const result = await db_1.pool.query(`
        INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
        `, [user_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, status]);
    console.log("rejalt", result);
    return result;
};
exports.makeBookingService = makeBookingService;
const getAllBookingService = async () => {
    const result = await db_1.pool.query(`SELECT * FROM bookings`);
    return result;
};
exports.getAllBookingService = getAllBookingService;
const getBookingByUserIdService = async (userId) => {
    console.log(userId);
    const result = await db_1.pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [userId]);
    return result;
};
exports.getBookingByUserIdService = getBookingByUserIdService;
const getBookingByVehicleIdService = async (vehicleId) => {
    const result = await db_1.pool.query(`SELECT * FROM bookings WHERE id=$1`, [vehicleId]);
    return result;
};
exports.getBookingByVehicleIdService = getBookingByVehicleIdService;
