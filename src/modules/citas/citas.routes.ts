import { Router } from "express";
import { inject, injectable } from "inversify";
import { CitaController } from "@modules/citas/citas.controller";
import { authMiddleware } from "@modules/auth/auth.middleware";
import TYPES from "@config/types";

@injectable()
export class CitasRoutes {
  public router: Router;
  private citaController: CitaController;

  constructor(
    @inject(TYPES.CitaController)
    citaController: CitaController
  ) {
    this.citaController = citaController;
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/agendar",
      authMiddleware,
      this.citaController.agendarCita
    );
    this.router.get(
      "/listar",
      authMiddleware,
      this.citaController.listarCitasUsuario
    );
    this.router.put(
      "/modificar/:id",
      authMiddleware,
      this.citaController.modificarCita
    );
    this.router.delete(
      "/cancelar/:id",
      authMiddleware,
      this.citaController.cancelarCita
    );
  }
}
