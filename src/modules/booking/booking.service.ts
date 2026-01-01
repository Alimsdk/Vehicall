import { pool } from "../../config/db";
import { getSingleVehicleService } from "../vehicle/vehicle.service";

const makeBookingService=async(payload:Record<string,unknown>)=>{
   
    const {user_id,vehicle_id,rent_start_date,rent_end_date,status}=payload;


    const start = new Date(rent_start_date as string);
const end = new Date(rent_end_date as string);

 
const MS_PER_DAY=24*60*60*1000;

  const rentedDays=Math.floor((end.getTime()-start.getTime())/MS_PER_DAY);


  const res=await getSingleVehicleService(vehicle_id as string);


  const {daily_rent_price}=res.rows[0];


  if(res.rows.length===0 || !rentedDays || !daily_rent_price){
   
    return null;
  }

if (start.getTime() >= end.getTime()) {
  return null;
}

  const totalPrice= Number(daily_rent_price * rentedDays);


console.log(user_id,vehicle_id,rent_start_date,rent_end_date,totalPrice,status);
    const result=await pool.query(`
        INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
        `,[user_id,vehicle_id,rent_start_date,rent_end_date,totalPrice,status]);
    console.log("rejalt",result);
        return result;
}

const getAllBookingService=async()=>{
   const result = await pool.query(`SELECT * FROM bookings`);
   return result;
}

const getBookingByUserIdService=async(userId:string)=>{
  console.log(userId);
  const result=await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`,[userId]);
  return result;
}

const getBookingByVehicleIdService=async(vehicleId:string)=>{
  const result=await pool.query(`SELECT * FROM bookings WHERE id=$1`,[vehicleId]);
  return result;
}



export {makeBookingService,getAllBookingService,getBookingByUserIdService,getBookingByVehicleIdService}