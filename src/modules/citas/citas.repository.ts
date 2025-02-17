import { Between, Repository } from "typeorm";
import { injectable, inject } from "inversify";
import { Cita } from "@modules/citas/citas.model";
import TYPES from "@config/types";

@injectable()
export class CitaRepository {
  private repo: Repository<Cita>;

  constructor(@inject(TYPES.TypeORMCitaRepository) repo: Repository<Cita>) {
    this.repo = repo;
  }

  async find(id: number): Promise<Cita[] | null> {
    return this.repo.find({ where: { id } });
  }

  async save(citaData: Partial<Cita>): Promise<Cita | null> {
    const cita = this.repo.create(citaData);
    return this.repo.save(cita);
  }

  async findById(id: number): Promise<Cita | null> {
    return this.repo.findOne({ where: { id } });
  }

  async crearCita(citaData: Partial<Cita>): Promise<Cita> {
    const cita = this.repo.create({ ...citaData, fecha: citaData.fecha });
    return this.repo.save(cita);
  }

  async obtenerCitasComoPaciente(usuarioId: number): Promise<Cita[]> {
    return this.repo.find({
      where: { paciente: { id: usuarioId } }, // Usamos la relación 'paciente'
      relations: ["paciente", "doctor"], // Incluimos las dos relaciones
    });
  }

  async obtenerCitasComoDoctor(usuarioId: number): Promise<Cita[]> {
    return this.repo.find({
      where: { doctor: { id: usuarioId } }, // Usamos la relación 'doctor'
      relations: ["paciente", "doctor"], // Incluimos las dos relaciones
    });
  }

  async actualizarCita(id: number, datos: Partial<Cita>): Promise<Cita | null> {
    const citaActualizada = await this.repo.preload({
      id,
      ...datos,
    });

    if (!citaActualizada) {
      return null; // Si no se encuentra la cita, retornar null
    }

    return this.repo.save(citaActualizada);
  }

  async findByFechaRange(inicio: Date, fin: Date): Promise<Cita[]> {
    return this.repo.find({
      where: {
        fecha: Between(inicio, fin),
      },
      relations: ["paciente", "doctor"],
    });
  }

  async eliminarCita(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
