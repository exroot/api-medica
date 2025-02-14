const TYPES = {
  // Usuarios
  UsuarioRepository: Symbol.for("UsuarioRepository"),
  UsuarioService: Symbol.for("UsuarioService"),
  UsuarioController: Symbol.for("UsuarioController"),

  //   Citas
  CitaRepository: Symbol.for("CitaRepository"),
  CitaService: Symbol.for("CitaService"),
  CitaController: Symbol.for("CitaController"),

  //   Auth
  AuthController: Symbol.for("AuthController"),
  AuthService: Symbol.for("AuthService"),
};

export default TYPES;
