"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleVehicleService = exports.updateSingleVehicleService = exports.getSingleVehicleService = exports.getAllVehicleService = exports.createVehicleService = void 0;
const db_1 = require("../../config/db");
const VEHICLE_TYPES = ['car', 'bike', 'van', 'suv'];
// create new vehicle service
const createVehicleService = async (payload) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    if (typeof type !== 'string') {
        throw new Error('Vehicle type must be a string');
    }
    // normalize
    const normalizedType = type.toLowerCase().trim();
    // validate
    if (!VEHICLE_TYPES.includes(normalizedType)) {
        throw new Error('Invalid vehicle type');
    }
    const vehicleType = normalizedType;
    console.log(vehicle_name, vehicleType, registration_number, daily_rent_price, availability_status);
    const result = await db_1.pool.query(`INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4, COALESCE($5, 'available')) RETURNING *`, [vehicle_name, vehicleType, registration_number, daily_rent_price, availability_status]);
    return result;
};
exports.createVehicleService = createVehicleService;
const getAllVehicleService = async () => {
    console.log("pacchii");
    const result = await db_1.pool.query(`SELECT * FROM vehicles`);
    return result;
};
exports.getAllVehicleService = getAllVehicleService;
const getSingleVehicleService = async (id) => {
    const result = await db_1.pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
    return result;
};
exports.getSingleVehicleService = getSingleVehicleService;
const updateSingleVehicleService = async (payload) => {
    const { id, vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result = await db_1.pool.query(`UPDATE vehicles SET
  vehicle_name = COALESCE($1, vehicle_name),
  type = COALESCE($2, type),
  registration_number = COALESCE($3, registration_number),
  daily_rent_price = COALESCE($4, daily_rent_price),
  availability_status = COALESCE($5, availability_status)
WHERE id = $6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]);
    return result;
};
exports.updateSingleVehicleService = updateSingleVehicleService;
const deleteSingleVehicleService = async (id) => {
    console.log(id);
    const result = await db_1.pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
    return result;
};
exports.deleteSingleVehicleService = deleteSingleVehicleService;
