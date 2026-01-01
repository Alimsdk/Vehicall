import { Request, Response } from "express";
import { createVehicleService, deleteSingleVehicleService, getAllVehicleService, getSingleVehicleService, updateSingleVehicleService } from "./vehicle.service";
import { getBookingByVehicleIdService } from "../booking/booking.service";

const registerVehicle=async(req:Request,res:Response)=>{

   try {
    const result=await createVehicleService(req.body);
   
    console.log("eta pailam");
    res.status(201).json({
        success:true,
        message:"Vehicle Registered Successfully",
        data:result.rows[0]
    })
   } catch (error:any) {
    res.status(500).json({
        success:false,
        message:error.message
    })
   }
}

const getAllVehicles=async(req:Request,res:Response)=>{
   try {
    const result=await getAllVehicleService();

     res.status(200).json({
        success:true,
        message:"Vehicles fetched Successfully",
        data:result.rows
    })

   } catch (error:any) {
     res.status(500).json({
        success:false,
        message:error.message
    })
   }
};

const getSingleVehicle=async(req:Request,res:Response)=>{
   try {
    const result=await getSingleVehicleService(req.params.vehicleId!);

     res.status(200).json({
        success:true,
        message:"Vehicles fetched Successfully",
        data:result.rows[0]
    })
   } catch (error:any) {
     res.status(500).json({
        success:false,
        message:error.message
    })
   }
}

const updateSingleVehicle=async(req:Request,res:Response)=>{
   const {vehicle_name,type,registration_number,daily_rent_price,availability_status}=req.body;
   const id=req.params.vehicleId as string;
  try {
   const result=await updateSingleVehicleService({id,vehicle_name,type,registration_number,daily_rent_price,availability_status});

   if(result.rowCount === 0){
        res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
   }else{
      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
        data: result.rows[0],
      });
   }
  } catch (error:any) {
    res.status(500).json({
        success:false,
        message:error.message
     })
  }
}


const deleteSingleVehicle=async(req:Request,res:Response)=>{
     try {
       const bookingsOfVehicle=await getBookingByVehicleIdService(req.params.userId as string);

     if(bookingsOfVehicle.rows.length !== 0){
            res.status(409).json({
        success:false,
        message:"User cannot be deleted because they have existing bookings"
     });
     }
     
      const result=await deleteSingleVehicleService(req.params.vehicleId as string);

      if(result.rowCount===0){
          res.status(404).json({
        success:false,
        message:"Vehicle not found"
     });


      }else{
         res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
        data: result.rows,
      });

      }
     }  catch (error:any) {
     res.status(500).json({
        success:false,
        message:error.message
     })

}}

export {registerVehicle,getAllVehicles,getSingleVehicle,updateSingleVehicle,deleteSingleVehicle}