import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import container from "@config/inversify.config";
import { UsuarioRoutes } from "@modules/usuarios/usuarios.routes";
import { CitaRoutes } from "@modules/citas/citas.routes";
import { AuthRoutes } from "@modules/auth/auth.routes";
import { errorHandler } from "@middlewares/errorHandler";
import TYPES from "@config/types";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setRoutes();
    this.setErrorHandling();
  }

  private setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  private setRoutes() {
    const usuariosRoutes = container.get<UsuarioRoutes>(TYPES.UsuarioRoutes);
    const citasRoutes = container.get<CitaRoutes>(TYPES.CitaRoutes);
    const authRoutes = container.get<AuthRoutes>(TYPES.AuthRoutes);

    this.app.use("/api/usuarios", usuariosRoutes.router);
    this.app.use("/api/citas", citasRoutes.router);
    this.app.use("/api/auth", authRoutes.router);
  }

  private setErrorHandling() {
    this.app.use(errorHandler);
  }
}

export default new App().app;
