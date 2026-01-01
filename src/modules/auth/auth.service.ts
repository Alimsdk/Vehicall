 import bcrypt from "bcrypt";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";
 
 const createUserService=async(payload:Record<string,unknown>)=>{
   const {name,email,phone,role,password} = payload;

    const hashedPassword=await bcrypt.hash(password as string,10);

    const result=await pool.query(
     `INSERT INTO users(name,email,phone,role,password) VALUES($1,LOWER($2),$3, COALESCE($4, 'user'),$5) RETURNING *`,[name,email,phone,role,hashedPassword]
      );

      return result;
}

const signInService=async(email:string,password:string)=>{
    const result=await pool.query(`SELECT * FROM users WHERE email = $1`,[email]);
     
    if(result.rows.length === 0){
      return null;
    }

    const user=result.rows[0];

    const isPasswordMatched=await bcrypt.compare(password,user.password);

    if(!isPasswordMatched){
      return null;
    }

    const token= jwt.sign({id:user.id,name:user.name,email:user.email,role:user.role},config.jwt_secret as string,{
      expiresIn:"7d"
    });

    return {token,user}

  
}

export {createUserService,signInService}