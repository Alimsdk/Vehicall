import { pool } from "../../config/db";

type VehicleType = 'car' | 'bike' | 'van' | 'suv';

const VEHICLE_TYPES: readonly VehicleType[] = ['car', 'bike', 'van', 'suv'];

// create new vehicle service

  const createVehicleService = async (payload: Record<string, unknown>) => {

  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  if (typeof type !== 'string') {
    throw new Error('Vehicle type must be a string');
  }

  // normalize
  const normalizedType = type.toLowerCase().trim();

  // validate
  if (!VEHICLE_TYPES.includes(normalizedType as VehicleType)) {
    throw new Error('Invalid vehicle type');
  }


  const vehicleType: VehicleType = normalizedType as VehicleType;


  console.log(vehicle_name, vehicleType, registration_number, daily_rent_price, availability_status);
  
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4, COALESCE($5, 'available')) RETURNING *`, [vehicle_name, vehicleType, registration_number, daily_rent_price, availability_status]
  );

  
  return result;
};

const getAllVehicleService = async () => {
  console.log("pacchii");
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
}

const getSingleVehicleService = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

  return result;
}

const updateSingleVehicleService = async (payload:{
  id: string, vehicle_name?: string, type?: string, registration_number?: string, daily_rent_price?: string, availability_status?: string
}) => {

 const {id,vehicle_name,type,registration_number,daily_rent_price,availability_status}=payload;
 
  const result = await pool.query(
    `UPDATE vehicles SET
  vehicle_name = COALESCE($1, vehicle_name),
  type = COALESCE($2, type),
  registration_number = COALESCE($3, registration_number),
  daily_rent_price = COALESCE($4, daily_rent_price),
  availability_status = COALESCE($5, availability_status)
WHERE id = $6 RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
  );

  return result;
};

const deleteSingleVehicleService = async (id: string) => {
  console.log(id);
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);

  return result;
}



export { createVehicleService, getAllVehicleService, getSingleVehicleService, updateSingleVehicleService, deleteSingleVehicleService }