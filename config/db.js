import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),  // ensure it's a number
});

db.connect()
  .then(() => console.log("Postgres connected!"))
  .catch(err => console.error("DB connection error:", err));

export default db;
