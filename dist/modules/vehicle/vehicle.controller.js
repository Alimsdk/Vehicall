"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleVehicle = exports.updateSingleVehicle = exports.getSingleVehicle = exports.getAllVehicles = exports.registerVehicle = void 0;
const vehicle_service_1 = require("./vehicle.service");
const booking_service_1 = require("../booking/booking.service");
const registerVehicle = async (req, res) => {
    try {
        const result = await (0, vehicle_service_1.createVehicleService)(req.body);
        console.log("eta pailam");
        res.status(201).json({
            success: true,
            message: "Vehicle Registered Successfully",
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
exports.registerVehicle = registerVehicle;
const getAllVehicles = async (req, res) => {
    try {
        const result = await (0, vehicle_service_1.getAllVehicleService)();
        res.status(200).json({
            success: true,
            message: "Vehicles fetched Successfully",
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
exports.getAllVehicles = getAllVehicles;
const getSingleVehicle = async (req, res) => {
    try {
        const result = await (0, vehicle_service_1.getSingleVehicleService)(req.params.vehicleId);
        res.status(200).json({
            success: true,
            message: "Vehicles fetched Successfully",
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
exports.getSingleVehicle = getSingleVehicle;
const updateSingleVehicle = async (req, res) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    const id = req.params.vehicleId;
    try {
        const result = await (0, vehicle_service_1.updateSingleVehicleService)({ id, vehicle_name, type, registration_number, daily_rent_price, availability_status });
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Vehicle updated successfully",
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
exports.updateSingleVehicle = updateSingleVehicle;
const deleteSingleVehicle = async (req, res) => {
    try {
        const bookingsOfVehicle = await (0, booking_service_1.getBookingByVehicleIdService)(req.params.userId);
        console.log(bookingsOfVehicle);
        if (bookingsOfVehicle.rows.length !== 0) {
            res.status(409).json({
                success: false,
                message: "Vehicle cannot be deleted because they have existing bookings"
            });
        }
        const result = await (0, vehicle_service_1.deleteSingleVehicleService)(req.params.vehicleId);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully",
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
exports.deleteSingleVehicle = deleteSingleVehicle;
