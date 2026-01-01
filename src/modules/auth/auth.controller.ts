import { Request, Response } from "express";
import { createUserService, signInService } from "./auth.service";

const createUser=async(req:Request,res:Response)=>{

   try {

    const result=await createUserService(req.body);

    res.status(201).json({
        success:true,
        message:"User Registered Successfully",
        data:result.rows[0]
    })
    
   } catch (error:any) {
    res.status(500).json({
        success:false,
        message:error.message
    })
   }
}

const loginUser=async(req:Request,res:Response)=>{
    const {email,password}=req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }
       try {
     
        const result=await signInService(email,password);

       if(!result){
           res.status(500).json({
        success:false,
        message:"login failed"
    })
       }

    res.status(201).json({
        success:true,
        message:"Signed In Successfully",
        data:result
    })
       }catch (error:any) {
    res.status(500).json({
        success:false,
        message:error.message
    })
   }
}

export {createUser,loginUser}