import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { UsuarioService } from "@modules/usuarios/usuarios.service";
import { AuthService } from "@modules/auth/auth.service";
import { AuthRequest } from "@modules/auth/auth.middleware";
import TYPES from "@config/types";

@injectable()
export class UsuarioController {
  private usuarioService: UsuarioService;
  private authService: AuthService;

  constructor(
    @inject(TYPES.UsuarioService) usuarioService: UsuarioService,
    @inject(TYPES.AuthService) authService: AuthService
  ) {
    this.usuarioService = usuarioService;
    this.authService = authService;
  }

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Error al registrar usuario", error });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const token = await this.authService.login(
        req.body.email,
        req.body.password
      );
      if (!token) {
        res.status(401).json({ message: "Credenciales inválidas" });
        return;
      }

      res.json({ token });
    } catch (error) {
      res.status(400).json({ message: "Error en el login", error });
    }
  };

  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      const user = await this.usuarioService.getProfile(Number(req.user.id));
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Error al obtener perfil", error });
    }
  };
}
