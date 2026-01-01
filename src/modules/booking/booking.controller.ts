import { Request, Response } from "express";
import { getAllBookingService, getBookingByUserIdService, makeBookingService } from "./booking.service";
import { updateSingleVehicleService } from "../vehicle/vehicle.service";
import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
import cron from "node-cron";

const makeBooking=async(req:Request,res:Response)=>{
   
    try {
       const result=await makeBookingService(req.body);

       console.log("hihihi",result);

       if(!result || result.rows.length === 0){
        return res.status(500).json({
        success:false,
        message:"Make booking failed",
       
    });
       }
         
    // change vehicle status to booked after booking confirmation
       await updateSingleVehicleService({id:result.rows[0]?.vehicle_id,availability_status:"booked"});

        res.status(201).json({
        success:true,
        message:"booking added successfully",
        data:result.rows[0]
    });

    }  catch (error:any) {
     res.status(500).json({
        success:false,
        message:error.message
    })
   }
}


const getAllBookings=async(req:Request,res:Response)=>{
    console.log(req.user);
    const {id,role}=req.user as JwtPayload;
    let result;
    try {
       if(role === "admin"){
          result=await getAllBookingService();
       }else{
          result=await getBookingByUserIdService(id);
       }

          res.status(200).json({
        success:true,
        message:"bookings fetched successfully",
        data:result.rows
    });


    }  catch (error:any) {
     res.status(500).json({
        success:false,
        message:error.message
    })
   }
}

const updateBookingInfo=async(req:Request,res:Response)=>{

  const { bookingId } = req.params;
  const {id:userId} = req.user as JwtPayload;     
  const {role:userRole} = req.user as JwtPayload;
  const { action } = req.body;

  try {
    // 1. Fetch the booking
    const result = await pool.query(
      "SELECT * FROM bookings WHERE id = $1",
      [bookingId]
    );
    const booking = result.rows[0];
    if (!booking) return res.status(404).json({ 
      sucess:false,
      message: "Booking not found"
    });

    const now = new Date();

    // CUSTOMER: Cancel booking before start date

    if (userRole === "customer") {
      if (booking.user_id !== userId)
        return res.status(403).json({success:false, message: "Forbidden" });

      if (action === "cancel") {
        if (new Date(booking.start_date) <= now)
          return res
            .status(400)
            .json({ message: "Cannot cancel after start date" });

        await pool.query(
          "UPDATE bookings SET status = 'cancelled' WHERE id = $1",
          [bookingId]
        );

        // Update vehicle availability
        await pool.query(
          "UPDATE vehicles SET availability_status = 'available' WHERE id = $1",
          [booking.vehicle_id]
        );

        return res.json({ message: "Booking cancelled successfully" });
      }

      return res.status(400).json({ message: "Invalid action for customer" });
    }

    // ADMIN: Mark as returned
    if (userRole === "admin") {
      if (action === "return") {
        await pool.query(
          "UPDATE bookings SET status = 'returned' WHERE id = $1",
          [bookingId]
        );
        await pool.query(
          "UPDATE vehicles SET availability_status = 'available' WHERE id = $1",
          [booking.vehicle_id]
        );
        return res.json({ message: "Booking marked as returned" });
      }

      return res.status(400).json({success:false, message: "Invalid action for admin" });
    }

   //  SYSTEM:
    
   cron.schedule("0 0 * * *",async()=>{
       const now = new Date();
  const result = await pool.query(
    "SELECT * FROM bookings WHERE status != 'returned' AND end_date < $1",
    [now]
  );

  for (const booking of result.rows) {
    await pool.query(
      "UPDATE bookings SET status = 'returned' WHERE id = $1",
      [booking.id]
    );
    await pool.query(
      "UPDATE vehicles SET availability_status = 'available' WHERE id = $1",
      [booking.vehicle_id]
    );
    console.log(`Auto-returned booking ${booking.id}`);
  }
   })

    return res.status(403).json({ success:false,message: "Action not allowed" });
  } catch (err) {
    
    res.status(500).json({
      success:false,
      message: "Internal server error" 
   
   });
  }
};




export {makeBooking,getAllBookings,updateBookingInfo}