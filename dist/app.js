"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const user_route_1 = require("./modules/user/user.route");
const vehicle_route_1 = require("./modules/vehicle/vehicle.route");
const auth_route_1 = require("./modules/auth/auth.route");
const booking_route_1 = require("./modules/booking/booking.route");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
// call db
(0, db_1.default)();
app.get("/", (req, res) => {
    res.status(200).send("Hello, World!");
});
app.use("/api/v1/users", user_route_1.userRouter);
app.use("/api/v1/auth", auth_route_1.authRouter);
app.use("/api/v1/vehicles", vehicle_route_1.vehicleRouter);
app.use("/api/v1/bookings", booking_route_1.bookingRouter);
// wrong route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    });
});
