import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(),".env")
});


const config={
    db_connection_str: process.env.DBCONNECTIONSTR,
    port:process.env.PORT,
    jwt_secret:process.env.jWTSECRET
}

export default config;