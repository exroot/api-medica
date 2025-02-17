import { Router } from "express";
import { inject, injectable } from "inversify";
import { UsuarioController } from "@modules/usuarios/usuarios.controller";
import { authMiddleware } from "@modules/auth/auth.middleware";
import TYPES from "@config/types";

@injectable()
export class UsuarioRoutes {
  public router: Router;

  constructor(
    @inject(TYPES.UsuarioController)
    private usuarioController: UsuarioController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/profile",
      authMiddleware,
      this.usuarioController.getProfile
    );
  }
}
