import { injectable, inject } from "inversify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UsuarioRepository } from "@modules/usuarios/usuarios.repository";
import { Usuario } from "@modules/usuarios/usuarios.model";
import TYPES from "@config/types";

@injectable()
export class UsuarioService {
  private usuarioRepository: UsuarioRepository;

  constructor(
    @inject(TYPES.UsuarioRepository) usuarioRepository: UsuarioRepository
  ) {
    this.usuarioRepository = usuarioRepository;
  }

  async getProfile(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findById(id);
  }

  async validarUsuarioExiste(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  }

  async update(
    id: number,
    updateData: Partial<Usuario>
  ): Promise<Usuario | null> {
    return this.usuarioRepository.update(id, updateData);
  }

  async delete(id: number): Promise<boolean> {
    return this.usuarioRepository.delete(id);
  }
}
