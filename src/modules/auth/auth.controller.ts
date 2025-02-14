import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { AuthService } from "@modules/auth/auth.service";
import TYPES from "@config/types";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: AuthService
  ) {}

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);

      if (!token) {
        res.status(401).json({ message: "Credenciales inválidas" });
        return;
      }

      res.json({ token });
    } catch (error) {
      res.status(400).json({ message: "Error en el login", error });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Error al registrar usuario", error });
    }
  };
}
