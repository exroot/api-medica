import { inject, injectable } from "inversify";
import { sign } from "jsonwebtoken";
import { UsuarioRepository } from "@modules/usuarios/usuarios.repository";
import { Usuario } from "@modules/usuarios/usuarios.model";
import TYPES from "@config/types";
import bcrypt from "bcryptjs";

@injectable()
export class AuthService {
  private usuarioRepository: UsuarioRepository;
  constructor(
    @inject(TYPES.UsuarioRepository) usuarioRepository: UsuarioRepository
  ) {
    this.usuarioRepository = usuarioRepository;
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.usuarioRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
  }

  async register(userData: Partial<Usuario>): Promise<Usuario> {
    userData.password = await bcrypt.hash(userData.password as string, 10);
    return this.usuarioRepository.create(userData);
  }
}
