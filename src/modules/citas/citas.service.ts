import { injectable, inject } from "inversify";
import { CitaRepository } from "@modules/citas/citas.repository";
import { UsuarioService } from "@modules/usuarios/usuarios.service";
import { Cita } from "@modules/citas/citas.model";
import { UsuarioNoExisteError } from "@utils/exceptions/usuarios.error";
import { RolUsuario, Usuario } from "@modules/usuarios/usuarios.model";
import { PagoService } from "@modules/pagos/pago.service";
import TYPES from "@config/types";

@injectable()
export class CitaService {
  private citaRepository: CitaRepository;
  private usuarioService: UsuarioService;
  private pagoService: PagoService;

  constructor(
    @inject(TYPES.CitaRepository) citaRepository: CitaRepository,
    @inject(TYPES.UsuarioService) usuarioService: UsuarioService,
    @inject(TYPES.PagoService) pagoService: PagoService
  ) {
    this.citaRepository = citaRepository;
    this.usuarioService = usuarioService;
    this.pagoService = pagoService;
  }

  async agendarCita(
    pacienteId: number,
    doctorId: number,
    fecha: Date,
    motivo: string
  ): Promise<Cita> {
    // Validación no se puede agendar una cita en el pasado
    if (fecha < new Date()) {
      console.log("log-- fecha: ", fecha);
      throw new Error("No se puede agendar una cita en el pasado");
    }

    const validTimeRange = this.validarHorarioAtencion(fecha);

    // Validación de horario de atención
    if (!validTimeRange) {
      throw new Error(
        "El horario de atención es de 7:00 a 12:00 y de 14:00 a 18:00"
      );
    }

    const [paciente, doctor] = await Promise.all([
      this.usuarioService.validarUsuarioExiste(pacienteId),
      this.usuarioService.validarUsuarioExiste(doctorId),
    ]);

    if (!paciente) {
      throw new UsuarioNoExisteError(pacienteId);
    }

    if (!doctor) {
      throw new UsuarioNoExisteError(doctorId);
    }

    if (paciente.rol !== RolUsuario.PACIENTE) {
      throw new Error("Solo los pacientes pueden pedir citas");
    }

    if (doctor.rol !== RolUsuario.MEDICO) {
      throw new Error("Solo los médicos pueden ser asignados a citas");
    }

    const cita = new Cita();
    cita.paciente = paciente;
    cita.doctor = doctor;
    cita.fecha = fecha;
    cita.motivo = motivo;

    // Validación no se puede pedir/agendar cita en un horario ya ocupado
    const validAvailableTime = await this.validarHorarioDisponible(
      fecha,
      pacienteId,
      doctorId
    );

    if (validAvailableTime === "paciente") {
      throw new Error("El paciente ya solicitó una cita en este horario.");
    }

    if (validAvailableTime === "doctor") {
      throw new Error("El doctor ya tiene asignada una cita en este horario.");
    }

    const result = await this.citaRepository.crearCita(cita);
    return {
      ...result,
      ...cita,
    };
  }

  async confirmarCita(usuario: Usuario, citaId: number): Promise<void> {
    if (usuario.rol !== RolUsuario.MEDICO) {
      throw new Error("Solo los médicos pueden confirmar citas");
    }

    const cita = await this.citaRepository.findById(citaId);

    if (!cita) {
      throw new Error("La cita no existe");
    }

    if (!cita.pagado) {
      throw new Error("No se puede confirmar una cita que no ha sido pagada");
    }

    const pagoExitoso = await this.pagoService.pagarCita(
      cita.monto,
      usuario.id
    );

    if (!pagoExitoso) {
      throw new Error("El pago no se pudo procesar");
    }

    cita.estado = "confirmada";
    cita.pagado = true;

    cita.estado = "confirmada";
    await this.citaRepository.actualizarCita(citaId, cita);
  }

  async listarCitasComoPaciente(usuarioId: number): Promise<Cita[]> {
    return this.citaRepository.obtenerCitasComoPaciente(usuarioId);
  }

  async listarCitasComoDoctor(usuarioId: number): Promise<Cita[]> {
    return this.citaRepository.obtenerCitasComoDoctor(usuarioId);
  }

  async modificarCita(id: number, datos: Partial<Cita>): Promise<Cita | null> {
    return this.citaRepository.actualizarCita(id, datos);
  }

  async cancelarCita(id: number): Promise<void> {
    return this.citaRepository.eliminarCita(id);
  }

  validarHorarioAtencion(fecha: Date) {
    const hora = fecha.getUTCHours(); // <-- Usar UTC

    const esHorarioValido =
      (hora >= 7 && hora < 12) || (hora >= 14 && hora < 18);

    if (!esHorarioValido) {
      return null;
    }
    return true;
  }

  async validarHorarioDisponible(
    fecha: Date,
    pacienteId: number,
    doctorId: number
  ): Promise<"paciente" | "doctor" | null> {
    const inicioRango = new Date(fecha);
    const finRango = new Date(fecha);

    finRango.setHours(finRango.getHours() + 1); // Agregar rango de tiempo de 1 hora para cada cita

    const citasDelDia = await this.citaRepository.findByFechaRange(
      inicioRango,
      finRango
    );

    const citaExistentePaciente = citasDelDia.some((cita) => {
      return cita.paciente.id === pacienteId;
    });

    if (citaExistentePaciente) {
      return "paciente";
    }

    const citaExistenteDoctor = citasDelDia.some((cita) => {
      return cita.doctor.id === doctorId;
    });

    if (citaExistenteDoctor) {
      return "doctor";
    }
    return null;
  }

  async reprogramarCita(
    citaId: number,
    nuevaFecha: Date
  ): Promise<Cita | null> {
    // Validación: no se puede reprogramar una cita en el pasado
    if (nuevaFecha < new Date()) {
      throw new Error("No se puede reprogramar una cita en el pasado");
    }

    // Validación de horario de atención
    const validTimeRange = this.validarHorarioAtencion(nuevaFecha);
    if (!validTimeRange) {
      throw new Error(
        "El horario de atención es de 7:00 a 12:00 y de 14:00 a 18:00"
      );
    }

    // Validación de disponibilidad en el horario
    const validAvailableTime = await this.validarHorarioDisponible(
      nuevaFecha,
      citaId, // Usamos el ID de la cita para verificar si el paciente o doctor ya están ocupados
      citaId // Usamos el ID de la cita para verificar si el paciente o doctor ya están ocupados
    );

    if (validAvailableTime === "paciente") {
      throw new Error("El paciente ya tiene una cita en este horario.");
    }

    if (validAvailableTime === "doctor") {
      throw new Error("El doctor ya tiene asignada una cita en este horario.");
    }

    const cita = await this.citaRepository.findById(citaId);
    if (!cita) {
      throw new Error("La cita no existe");
    }

    // Actualizar la fecha de la cita
    cita.fecha = nuevaFecha;
    const resultado = await this.citaRepository.actualizarCita(citaId, cita);
    return resultado;
  }
}
