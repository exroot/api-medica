import "reflect-metadata";
import "module-alias/register";
import { AppDataSource } from "@config/database";
import app from "./app";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("📌 Conexión a la base de datos establecida correctamente");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar con la base de datos", error);
  });
