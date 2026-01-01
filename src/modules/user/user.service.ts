import { pool } from "../../config/db";
import bcrypt from "bcrypt";

const getAllUserService=async()=>{
  const result=await pool.query(`SELECT * FROM users`);
  return result;
}

const updateSingleUserService = async (id: string, name?: string, email?: string, phone?: string, role?: string, password?: string) => {
  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  const result = await pool.query(
    `UPDATE users SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      role = COALESCE($4, role),
      password = COALESCE($5, password)
    WHERE id = $6
    RETURNING *`,
    [name, email, phone, role, hashedPassword, id]
  );

  return result;
};

const deleteSingleUserService=async(id:string)=>{
  console.log(id);
   const result=await pool.query(`DELETE FROM users WHERE id = $1`,[id]);

   return result;
}

export {getAllUserService,updateSingleUserService,deleteSingleUserService}
