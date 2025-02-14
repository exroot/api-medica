import { Router } from "express";
import { inject, injectable } from "inversify";
import { UsuarioController } from "@modules/usuarios/usuarios.controller";
import { validateUser } from "@middlewares/userValidation.middleware";
import { authMiddleware } from "@modules/auth/auth.middleware";
import TYPES from "@config/types";

@injectable()
export class UsuarioRoutes {
  public router: Router;
  private usuarioController: UsuarioController;

  constructor(
    @inject(TYPES.UsuarioController) usuarioController: UsuarioController
  ) {
    this.router = Router();
    this.initializeRoutes();
    this.usuarioController = usuarioController;
  }

  private initializeRoutes() {
    this.router.post(
      "/register",
      validateUser,
      this.usuarioController.register
    );
    this.router.post("/login", this.usuarioController.login);
    this.router.get(
      "/profile",
      authMiddleware,
      this.usuarioController.getProfile
    );
    this.router.put(
      "/update/:id",
      authMiddleware,
      this.usuarioController.update
    );
    this.router.delete(
      "/delete/:id",
      authMiddleware,
      this.usuarioController.delete
    );
  }
}
