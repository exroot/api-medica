export class UsuarioNoExisteError extends Error {
  constructor(usuarioId: number) {
    super(`El usuario con ID ${usuarioId} no existe.`);
    this.name = "UsuarioNoExisteError";
  }
}
