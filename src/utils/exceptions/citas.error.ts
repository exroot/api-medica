export class CitaNoDisponibleError extends Error {
  constructor(fecha: Date) {
    super(`No hay citas disponibles para la fecha ${fecha}.`);
    this.name = "CitaNoDisponibleError";
  }
}
