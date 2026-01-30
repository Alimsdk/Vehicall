"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const _1 = __importDefault(require("."));
exports.pool = new pg_1.Pool({
    connectionString: _1.default.db_connection_str
});
const initDb = async () => {
    await exports.pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        CHECK(char_length(password) >= 6),
        phone VARCHAR(15) NOT NULL,
        role TEXT DEFAULT 'user',
        CHECK (role IN ('user', 'admin')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
    await exports.pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name TEXT NOT NULL,
    type TEXT CHECK(type IN ('car','bike','van','suv')) NOT NULL,
    registration_number TEXT UNIQUE NOT NULL,
    daily_rent_price NUMERIC(10,2) CHECK(daily_rent_price >= 0),
    availability_status TEXT DEFAULT 'available' CHECK(availability_status IN ('available','booked'))
 
        )
            `);
    await exports.pool.query(`
            CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price NUMERIC(10,2) NOT NULL,
            status TEXT DEFAULT 'active',
            CHECK (status IN ('active', 'cancelled','returned')),
            CHECK (rent_end_date > rent_start_date),
            CHECK (total_price > 0)
            )
            `);
};
exports.default = initDb;
