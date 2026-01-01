import { Request, Response } from "express";
import { deleteSingleUserService, getAllUserService, updateSingleUserService } from "../user/user.service";
import { getBookingByUserIdService } from "../booking/booking.service";



const getAllUsers=async(req:Request,res:Response)=>{
   try {
    const result=await getAllUserService();

     res.status(201).json({
        success:true,
        message:"User fetched Successfully",
        data:result.rows
    })

   } catch (error:any) {
     res.status(500).json({
        success:false,
        message:error.message
    })
   }
};


type UserRole = "user" | "admin";

const updateSingleUser=async(req:Request,res:Response)=>{
   const {name,email,phone,role,password}:{name:"string",email:"string",phone:"string",role:UserRole,password:string}=req.body;
   const id=req.params.userId;
   const decoded=req.user;

     if (!decoded) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (decoded.role === "user" && Number(decoded.id) !== Number(id)) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: You can only access your own data",
    });
  }

  try {
  
   const result=await updateSingleUserService(id as string,name,email,phone,role,password);

   if(result.rowCount === 0){
        res.status(404).json({
        success: false,
        message: "User not found",
      });
   }else{
      res.status(200).json({
        success: true,
        message: "User updated successfully",
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

const deleteSingleUser=async(req:Request,res:Response)=>{
     try {
     const bookingsByUser=await getBookingByUserIdService(req.params.userId as string);

     if(bookingsByUser.rows.length !== 0){
            res.status(409).json({
        success:false,
        message:"User cannot be deleted because they have existing bookings"
     });
     }
     
      const result=await deleteSingleUserService(req.params.userId as string);

      if(result.rowCount===0){
          res.status(404).json({
        success:false,
        message:"User not found"
     });


      }else{
         res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result.rows,
      });

      }
     }  catch (error:any) {
     res.status(500).json({
        success:false,
        message:error.message
     })

}}

export {getAllUsers,updateSingleUser,deleteSingleUser}