"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRouter = void 0;
const express_1 = require("express");
const vehicle_controller_1 = require("./vehicle.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = (0, express_1.Router)();
exports.vehicleRouter = router;
router.post("/", (0, auth_1.default)("admin"), vehicle_controller_1.registerVehicle);
router.get("/", vehicle_controller_1.getAllVehicles);
router.get("/:vehicleId", vehicle_controller_1.getSingleVehicle);
router.put("/:vehicleId", (0, auth_1.default)("admin"), vehicle_controller_1.updateSingleVehicle);
router.delete("/:vehicleId", (0, auth_1.default)("admin"), vehicle_controller_1.deleteSingleVehicle);
