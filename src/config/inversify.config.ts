import "reflect-metadata";
import { Container } from "inversify";
import { UsuarioService } from "@modules/usuarios/usuarios.service";
import { CitaService } from "@modules/citas/citas.service";
import { UsuarioRepository } from "@modules/usuarios/usuarios.repository";
import { CitaRepository } from "@modules/citas/citas.repository";
import { AuthController } from "@modules/auth/auth.controller";
import { CitaController } from "@modules/citas/citas.controller";
import { UsuarioController } from "@modules/usuarios/usuarios.controller";
import { AuthService } from "@modules/auth/auth.service";
import TYPES from "@config/types";

const container = new Container();

// Usuarios
container
  .bind<UsuarioRepository>(TYPES.UsuarioRepository)
  .to(UsuarioRepository); // Vincular UsuarioRepository a TYPES.UsuarioRepository
container.bind<UsuarioService>(TYPES.UsuarioService).to(UsuarioService); // Vincular UsuarioService a TYPES.UsuarioService
container
  .bind<UsuarioController>(TYPES.UsuarioController)
  .to(UsuarioController); // Vincular UsuarioController a TYPES.UsuarioController

// Citas
container.bind<CitaRepository>(TYPES.CitaRepository).to(CitaRepository); // Vincular CitaRepository a TYPES.CitaRepository
container.bind<CitaService>(TYPES.CitaService).to(CitaService); // Vincular CitaService a TYPES.CitaService
container.bind<CitaController>(TYPES.CitaController).to(CitaController); // Vincular CitaController a TYPES.CitaController

// Auth
container.bind<AuthController>(TYPES.AuthController).to(AuthController); // Vincular AuthController a TYPES.AuthController
container.bind<AuthService>(TYPES.AuthService).to(AuthService); // Vincular AuthService a TYPES.AuthService

export default container;
