import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Usuario } from "@modules/usuarios/usuarios.model";
import { Cita } from "@modules/citas/citas.model";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql", // 🔄 Cambiado de "postgres" a "mysql"
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // Generalmente 3306 para MySQL
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false, // ⚠️ Solo para desarrollo. En producción usar migraciones
  logging: false,
  entities: [Usuario, Cita], // Agregar cada entidad creada aquí
});

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Conexión a la base de datos MySQL establecida");
  })
  .catch((error) => {
    console.error("❌ Error al conectar la base de datos:", error);
  });
