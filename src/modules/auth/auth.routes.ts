import { Router } from "express";
import { inject, injectable } from "inversify";
import { AuthController } from "@modules/auth/auth.controller";
import {
  validateRegisterUser,
  validateLoginUser,
} from "@middlewares/userValidation.middleware";
import TYPES from "@config/types";

@injectable()
export class AuthRoutes {
  public router: Router;
  private authController: AuthController;

  constructor(@inject(TYPES.AuthController) authController: AuthController) {
    this.authController = authController;
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/login", validateLoginUser, this.authController.login);
    this.router.post(
      "/register",
      validateRegisterUser,
      this.authController.register
    );
  }
}
