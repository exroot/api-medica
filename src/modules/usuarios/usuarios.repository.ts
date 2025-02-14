import { injectable, inject } from "inversify";
import { Repository } from "typeorm";
import { Usuario } from "@modules/usuarios/usuarios.model";
import TYPES from "@config/types";

@injectable()
export class UsuarioRepository {
  private repo: Repository<Usuario>;

  constructor(@inject(TYPES.UsuarioRepository) repo: Repository<Usuario>) {
    this.repo = repo;
  }

  async findById(id: number): Promise<Usuario | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.repo.findOne({ where: { email } });
  }

  async create(userData: Partial<Usuario>): Promise<Usuario> {
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }

  async update(
    id: number,
    updateData: Partial<Usuario>
  ): Promise<Usuario | null> {
    const user = await this.repo.preload({ id, ...updateData });
    if (!user) return null;
    return this.repo.save(user);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}
