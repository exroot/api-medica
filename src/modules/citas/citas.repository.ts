import { Repository } from "typeorm";
import { injectable, inject } from "inversify";
import { Cita } from "@modules/citas/citas.model";
import TYPES from "@config/types";

@injectable()
export class CitaRepository {
  private repo: Repository<Cita>;

  constructor(@inject(TYPES.CitaRepository) repo: Repository<Cita>) {
    this.repo = repo;
  }

  async crearCita(citaData: Partial<Cita>): Promise<Cita> {
    const cita = this.repo.create(citaData);
    return this.repo.save(cita);
  }

  async obtenerCitasPorUsuario(usuarioId: number): Promise<Cita[]> {
    return this.repo.find({
      where: { usuario: { id: usuarioId } },
      relations: ["usuario"],
    });
  }

  async actualizarCita(id: number, datos: Partial<Cita>): Promise<Cita | null> {
    await this.repo.update(id, datos);
    return this.repo.findOne({ where: { id } });
  }

  async eliminarCita(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
