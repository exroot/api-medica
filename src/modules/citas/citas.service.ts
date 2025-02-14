import { injectable, inject } from "inversify";
import { CitaRepository } from "@modules/citas/citas.repository";
import { UsuarioService } from "@modules/usuarios/usuarios.service";
import { Cita } from "@modules/citas/citas.model";
import { UsuarioNoExisteError } from "@utils/exceptions/usuarios.error";
import TYPES from "@config/types";

@injectable()
export class CitaService {
  private citaRepository: CitaRepository;
  private usuarioService: UsuarioService;

  constructor(
    @inject(TYPES.CitaRepository) citaRepository: CitaRepository,
    @inject(TYPES.UsuarioService) usuarioService: UsuarioService
  ) {
    this.citaRepository = citaRepository;
    this.usuarioService = usuarioService;
  }

  async agendarCita(
    usuarioId: number,
    fecha: Date,
    motivo?: string
  ): Promise<Cita> {
    const usuario = await this.usuarioService.validarUsuarioExiste(usuarioId);
    if (!usuario) {
      throw new UsuarioNoExisteError(usuarioId);
    }
    return this.citaRepository.crearCita({
      usuario,
      fecha,
      motivo,
    });
  }

  async listarCitasUsuario(usuarioId: number): Promise<Cita[]> {
    return this.citaRepository.obtenerCitasPorUsuario(usuarioId);
  }

  async modificarCita(id: number, datos: Partial<Cita>): Promise<Cita | null> {
    return this.citaRepository.actualizarCita(id, datos);
  }

  async cancelarCita(id: number): Promise<void> {
    return this.citaRepository.eliminarCita(id);
  }
}
