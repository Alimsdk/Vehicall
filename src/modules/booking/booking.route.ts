import { Router } from "express";
import { getAllBookings, makeBooking, updateBookingInfo } from "./booking.controller";
import auth from "../../middleware/auth";

const router=Router();

router.post("/",auth("user","admin"),makeBooking);

router.get("/",auth("user","admin"),getAllBookings);

router.put("/:bookingId",auth("user","admin"),updateBookingInfo)

export {router as bookingRouter}