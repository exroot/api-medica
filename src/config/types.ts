const TYPES = {
  // TypeORM Usuarios Repository
  TypeORMUsuarioRepository: Symbol.for("TypeORMUsuarioRepository"), // Nuevo símbolo
  UsuarioService: Symbol.for("UsuarioService"),
  UsuarioController: Symbol.for("UsuarioController"),
  UsuarioRoutes: Symbol.for("UsuarioRoutes"),

  // TypeORM Citas Repository
  TypeORMCitaRepository: Symbol.for("TypeORMCitaRepository"), // Nuevo símbolo
  CitaRepository: Symbol.for("CitaRepository"),
  CitaService: Symbol.for("CitaService"),
  CitaController: Symbol.for("CitaController"),
  CitaRoutes: Symbol.for("CitaRoutes"),

  // Auth
  AuthController: Symbol.for("AuthController"),
  AuthService: Symbol.for("AuthService"),
  AuthRoutes: Symbol.for("AuthRoutes"),

  // Pagos
  PagoService: Symbol.for("PagoService"),
  PagoController: Symbol.for("PagoController"),
  PagoRoutes: Symbol.for("PagoRoutes"),
};

export default TYPES;
