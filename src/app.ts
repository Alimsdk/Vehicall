import express, { Request, Response } from "express";
import initDb from "./config/db";
import { userRouter } from "./modules/user/user.route";
import { registerVehicle } from "./modules/vehicle/vehicle.controller";
import { vehicleRouter } from "./modules/vehicle/vehicle.route";
import { authRouter } from "./modules/auth/auth.route";
import { bookingRouter } from "./modules/booking/booking.route";

const app = express();


app.use(express.json());

// call db

initDb();

app.get("/", (req:Request,res:Response)=>{
    res.status(200).send("Hello, World!");
});

app.use("/api/v1/users",userRouter);

app.use("/api/v1/auth",authRouter)

app.use("/api/v1/vehicles",vehicleRouter);

app.use("/api/v1/bookings",bookingRouter);

// wrong route

app.use((req,res)=>{
  res.status(404).json({
    success:false,
    message:"Route not found",
    path:req.path
  })
});

export {app}










