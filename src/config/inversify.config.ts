import { Container } from "inversify";
import { UsuarioService } from "@modules/usuarios/usuarios.service";
import { CitaService } from "@modules/citas/citas.service";
import { AuthController } from "@modules/auth/auth.controller";
import { CitaController } from "@modules/citas/citas.controller";
import { UsuarioController } from "@modules/usuarios/usuarios.controller";
import { AuthService } from "@modules/auth/auth.service";
import { UsuarioRoutes } from "@modules/usuarios/usuarios.routes";
import { CitaRoutes } from "@modules/citas/citas.routes";
import { AuthRoutes } from "@modules/auth/auth.routes";
import { PagoService } from "@modules/pagos/pago.service";
import { PagoController } from "@modules/pagos/pago.controller";
import { PagoRoutes } from "@modules/pagos/pago.routes";
import { Usuario } from "@modules/usuarios/usuarios.model";
import { Repository } from "typeorm";
import { AppDataSource } from "./database";
import TYPES from "@config/types";
import { Cita } from "@modules/citas/citas.model";
import { CitaRepository } from "@modules/citas/citas.repository";

const container = new Container();

container
  .bind<Repository<Usuario>>(TYPES.TypeORMUsuarioRepository)
  .toDynamicValue(() => AppDataSource.getRepository(Usuario))
  .inRequestScope();

container
  .bind<Repository<Cita>>(TYPES.TypeORMCitaRepository)
  .toDynamicValue(() => AppDataSource.getRepository(Cita))
  .inRequestScope();

// Services
// Vincular CitaRepository

// Vincular CitaRepository
container.bind<CitaRepository>(TYPES.CitaRepository).to(CitaRepository);

container.bind<UsuarioService>(TYPES.UsuarioService).to(UsuarioService); // Vincular UsuarioService a TYPES.UsuarioService
container.bind<AuthService>(TYPES.AuthService).to(AuthService); // Vincular AuthService a TYPES.AuthService
container.bind<CitaService>(TYPES.CitaService).to(CitaService); // Vincular CitaService a TYPES.CitaService
container.bind<PagoService>(TYPES.PagoService).to(PagoService); // Vincular PagoService a TYPES.PagoService

// Usuarios

container
  .bind<UsuarioController>(TYPES.UsuarioController)
  .to(UsuarioController); // Vincular UsuarioController a TYPES.UsuarioController
container.bind<AuthController>(TYPES.AuthController).to(AuthController); // Vincular AuthController a TYPES.AuthController
container.bind<CitaController>(TYPES.CitaController).to(CitaController); // Vincular CitaController a TYPES.CitaController
container.bind<PagoController>(TYPES.PagoController).to(PagoController); // Vincular PagoService a TYPES.PagoService

// Citas
container.bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes); // Vincular AuthRoutes a TYPES.AuthRoutes
container.bind<CitaRoutes>(TYPES.CitaRoutes).to(CitaRoutes); // Vincular CitaRoutes a TYPES.CitaRoutes
container.bind<UsuarioRoutes>(TYPES.UsuarioRoutes).to(UsuarioRoutes); // Vincular UsuarioRoutes a TYPES.UsuarioRoutes

// Pago
container.bind<PagoRoutes>(TYPES.PagoRoutes).to(PagoRoutes); // Vincular PagoService a TYPES.PagoService

export default container;
