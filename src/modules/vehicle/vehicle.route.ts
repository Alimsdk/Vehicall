import { Router } from "express";
import { deleteSingleVehicle, getAllVehicles, getSingleVehicle, registerVehicle, updateSingleVehicle } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router=Router();

router.post("/",auth("admin"),registerVehicle);

router.get("/",getAllVehicles);

router.get("/:vehicleId",getSingleVehicle);

router.put("/:vehicleId",auth("admin"),updateSingleVehicle);

router.delete("/:vehicleId",auth("admin"),deleteSingleVehicle);

export {router as vehicleRouter}