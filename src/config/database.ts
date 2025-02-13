// Configuración de PostgreSQL con TypeORM
import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true, // ⚠️ Solo para desarrollo. En producción usar migraciones
  logging: false,
  //   entities: [Usuario, Cita], // Agregar cada entidad creada aquí
});

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Conexión a la base de datos establecida");
  })
  .catch((error) => {
    console.error("❌ Error al conectar la base de datos:", error);
  });
