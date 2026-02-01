import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

export const runtime = "nodejs";

const auth=(...roles:string[])=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
       try {
        const authHeader=req.headers.authorization as string;
       console.log(authHeader);
        if(!authHeader){
            res.status(500).json({
                success:false,
                message:"you are not allowed"
            })
        };

         const token = authHeader.split(" ")[1];

         console.log(config.jwt_secret,token);

          if (!token) return res.status(401).json({ message: "No token" });
     
      
        const decoded=jwt.verify(token as string,config.jwt_secret!) as JwtPayload;


        req.user=decoded;

        console.log(req.user);

         if(roles.length && !roles.includes(decoded.role)){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
         }

         next();
       } catch (err:any) {
        res.status(500).json({
        success: false,
        message: err.message,
      });
       }
    }
}

export default auth;