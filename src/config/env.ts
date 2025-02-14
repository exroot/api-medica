// Carga de variables de entorno
import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    pass: process.env.DB_PASS || "password",
    name: process.env.DB_NAME || "api_medica",
  },
  JWT_SECRET: process.env.JWT_SECRET || "supersecreto",
};
