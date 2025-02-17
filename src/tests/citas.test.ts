import { CitaService } from "@modules/citas/citas.service";
import { CitaRepository } from "@modules/citas/citas.repository";
import { UsuarioService } from "@modules/usuarios/usuarios.service";
import { Cita } from "@modules/citas/citas.model";
import { Usuario } from "@modules/usuarios/usuarios.model";
import { UsuarioNoExisteError } from "@utils/exceptions/usuarios.error";
import { PagoService } from "@modules/pagos/pago.service";

const DEFAULT_VALID_DATE = "2026-02-14T15:00:00.463Z"; // 3:00 pm
const DEFAULT_INVALID_DATE = "2025-06-14T20:00:00.463Z"; // 8:00 pm

describe("CitaService", () => {
  let citaService: CitaService;
  let citaRepositoryMock: jest.Mocked<CitaRepository>;
  let usuarioServiceMock: jest.Mocked<UsuarioService>;
  let pagoServiceMock: jest.Mocked<PagoService>;

  beforeEach(() => {
    // Mock del repositorio de citas
    citaRepositoryMock = {
      crearCita: jest.fn().mockResolvedValue({ id: 1 } as Cita),
      findByFechaRange: jest.fn().mockResolvedValue([]),
      find: jest.fn().mockResolvedValue([]), // Agregado: Mock de `find`
      actualizarCita: jest.fn(),
    } as unknown as jest.Mocked<CitaRepository>;

    // Mock del servicio de usuarios
    usuarioServiceMock = {
      validarUsuarioExiste: jest.fn(),
    } as unknown as jest.Mocked<UsuarioService>;

    // Mock del servicio de pagos
    pagoServiceMock = {
      pagarCita: jest.fn(),
    } as unknown as jest.Mocked<PagoService>;

    // Instanciamos el servicio con los mocks
    citaService = new CitaService(
      citaRepositoryMock,
      usuarioServiceMock,
      pagoServiceMock
    );
  });

  it("debería agendar una cita correctamente", async () => {
    const paciente = { id: 1, rol: "paciente" } as Usuario;
    const doctor = { id: 2, rol: "medico" } as Usuario;

    // Configuramos el mock para devolver los usuarios correctos
    usuarioServiceMock.validarUsuarioExiste
      .mockResolvedValueOnce(paciente)
      .mockResolvedValueOnce(doctor);

    // Ejecutamos el método a probar
    const cita = await citaService.agendarCita(
      1,
      2,
      new Date(DEFAULT_VALID_DATE),
      "Consulta médica nueva"
    );

    // Validamos que la cita fue creada correctamente
    expect(cita).toBeDefined();
    expect(cita.id).toBe(1);
    expect(citaRepositoryMock.crearCita).toHaveBeenCalledTimes(1);
    expect(usuarioServiceMock.validarUsuarioExiste).toHaveBeenCalledTimes(2);
  });

  it("debería lanzar un error si el paciente no existe", async () => {
    const paciente = { id: 9, rol: "paciente" } as Usuario;
    const doctor = { id: 2, rol: "medico" } as Usuario;

    // Simulamos que el paciente no existe
    usuarioServiceMock.validarUsuarioExiste.mockRejectedValueOnce(
      new UsuarioNoExisteError(1)
    );

    // Verificamos que se lance el error cuando se intenta agendar una cita
    await expect(
      citaService.agendarCita(
        paciente.id,
        doctor.id,
        new Date(DEFAULT_VALID_DATE),
        "Consulta médica"
      )
    ).rejects.toThrowError(UsuarioNoExisteError);
  });

  it("debería lanzar un error si el doctor no existe", async () => {
    const paciente = { id: 1, rol: "paciente" } as Usuario;
    const doctor = { id: 9, rol: "medico" } as Usuario;
    usuarioServiceMock.validarUsuarioExiste.mockResolvedValueOnce(paciente);

    // Verificamos que se lance el error cuando el doctor no existe
    await expect(
      citaService.agendarCita(
        paciente.id,
        doctor.id,
        new Date(DEFAULT_VALID_DATE),
        "Consulta médica"
      )
    ).rejects.toThrowError(UsuarioNoExisteError);
  });

  it("debería lanzar un error si el paciente no es paciente", async () => {
    const paciente = { id: 1, rol: "medico" } as Usuario;
    const doctor = { id: 2, rol: "medico" } as Usuario;
    usuarioServiceMock.validarUsuarioExiste.mockResolvedValueOnce(paciente);
    usuarioServiceMock.validarUsuarioExiste.mockResolvedValueOnce(doctor);

    // Verificamos que se lance el error cuando el paciente no tiene rol de 'paciente'
    await expect(
      citaService.agendarCita(
        paciente.id,
        doctor.id,
        new Date(DEFAULT_VALID_DATE),
        "Consulta médica"
      )
    ).rejects.toThrow("Solo los pacientes pueden pedir citas");
  });

  it("debería lanzar un error si el doctor no es médico", async () => {
    const paciente = { id: 1, rol: "paciente" } as Usuario;
    const doctor = { id: 2, rol: "paciente" } as Usuario;
    usuarioServiceMock.validarUsuarioExiste.mockResolvedValueOnce(paciente);
    usuarioServiceMock.validarUsuarioExiste.mockResolvedValueOnce(doctor);

    // Verificamos que se lance el error cuando el doctor no tiene rol de 'medico'
    await expect(
      citaService.agendarCita(
        paciente.id,
        doctor.id,
        new Date(DEFAULT_VALID_DATE),
        "Consulta médica"
      )
    ).rejects.toThrow("Solo los médicos pueden ser asignados a citas");
  });

  it("debería lanzar un error si el horario no está disponible para el paciente", async () => {
    const paciente = { id: 1, rol: "paciente" } as Usuario;
    const doctor = { id: 2, rol: "medico" } as Usuario;
    const doctor2 = { id: 3, rol: "medico" } as Usuario;
    const fecha = new Date(DEFAULT_VALID_DATE);

    usuarioServiceMock.validarUsuarioExiste.mockResolvedValueOnce(paciente);
    usuarioServiceMock.validarUsuarioExiste.mockResolvedValueOnce(doctor);

    // Mock de citas previas en el mismo horario
    citaRepositoryMock.findByFechaRange.mockResolvedValueOnce([
      { doctor, paciente, fecha },
    ] as Cita[]);

    // Verificamos que se lance el error si el paciente ya tiene una cita en ese horario
    await expect(
      citaService.agendarCita(paciente.id, doctor2.id, fecha, "Consulta médica")
    ).rejects.toThrow("El paciente ya solicitó una cita en este horario.");
  });

  it("debería lanzar un error si el horario no está disponible para el doctor", async () => {
    const paciente = { id: 1, rol: "paciente" } as Usuario;
    const paciente2 = { id: 3, rol: "paciente" } as Usuario;
    const doctor = { id: 2, rol: "medico" } as Usuario;
    const fecha = new Date(DEFAULT_VALID_DATE);

    usuarioServiceMock.validarUsuarioExiste.mockResolvedValueOnce(paciente);
    usuarioServiceMock.validarUsuarioExiste.mockResolvedValueOnce(doctor);

    // Mock de citas previas del doctor en el mismo horario
    citaRepositoryMock.findByFechaRange.mockResolvedValueOnce([
      { doctor, paciente, fecha },
    ] as Cita[]);

    // Verificamos que se lance el error si el doctor ya tiene una cita en ese horario
    await expect(
      citaService.agendarCita(paciente2.id, doctor.id, fecha, "Consulta médica")
    ).rejects.toThrow("El doctor ya tiene asignada una cita en este horario.");
  });

  it("debería lanzar un error si el horario está fuera del rango de atención", async () => {
    const paciente = { id: 1, rol: "paciente" } as Usuario;
    const doctor = { id: 2, rol: "medico" } as Usuario;
    usuarioServiceMock.validarUsuarioExiste.mockResolvedValueOnce(paciente);
    usuarioServiceMock.validarUsuarioExiste.mockResolvedValueOnce(doctor);
    const fechaFueraDeRango = new Date(DEFAULT_INVALID_DATE);

    // Verificamos que se lance un error si el horario está fuera del rango permitido
    await expect(
      citaService.agendarCita(
        paciente.id,
        doctor.id,
        fechaFueraDeRango,
        "Consulta médica"
      )
    ).rejects.toThrow(
      "El horario de atención es de 7:00 a 12:00 y de 14:00 a 18:00"
    );
  });

  it("debería lanzar un error si se intenta reprogramar una cita en el pasado", async () => {
    const fechaPasada = new Date();
    fechaPasada.setDate(fechaPasada.getDate() - 1); // Asegura que la fecha es en el pasado

    // Mock de citaRepository.findById
    citaRepositoryMock.findById = jest.fn().mockResolvedValue(new Cita());

    // Verificamos que no se pueda reprogramar una cita en el pasado
    await expect(citaService.reprogramarCita(1, fechaPasada)).rejects.toThrow(
      "No se puede reprogramar una cita en el pasado"
    );
  });

  it("debería permitir reprogramar una cita existente", async () => {
    const paciente = { id: 1, rol: "paciente" } as Usuario;
    const doctor = { id: 2, rol: "medico" } as Usuario;
    const fechaOriginal = new Date(DEFAULT_VALID_DATE);
    const fechaReprogramada = new Date("2026-03-14T10:00:00.463Z"); // 10:00 AM

    usuarioServiceMock.validarUsuarioExiste.mockResolvedValueOnce(paciente);
    usuarioServiceMock.validarUsuarioExiste.mockResolvedValueOnce(doctor);

    const citaOriginal = await citaService.agendarCita(
      paciente.id,
      doctor.id,
      fechaOriginal,
      "Consulta médica original"
    );

    // Mock de citas anteriores
    citaRepositoryMock.findById = jest.fn().mockResolvedValue(new Cita());
    citaRepositoryMock.find.mockResolvedValueOnce([citaOriginal]);

    // Mock de citaRepository.actualizarCita para que devuelva la cita actualizada
    citaRepositoryMock.actualizarCita = jest.fn().mockResolvedValue({
      ...citaOriginal,
      fecha: fechaReprogramada,
    });

    // Verificamos que la cita sea reprogramada correctamente
    const citaReprogramada = await citaService.reprogramarCita(
      citaOriginal.id,
      fechaReprogramada
    );

    expect(citaReprogramada).toBeDefined();
    expect(citaReprogramada?.fecha).toEqual(fechaReprogramada);
  });

  it("debería permitir confirmar una cita si el pago es exitoso y el usuario es médico", async () => {
    // Mock de datos
    const cita = new Cita();
    cita.id = 1;
    cita.pagado = true; // El pago está realizado
    cita.monto = 100;
    cita.estado = "pendiente";

    const medico = { id: 1, rol: "medico" } as any; // Simulamos que es un médico

    // Mock de la función que devuelve la cita
    citaRepositoryMock.findById = jest.fn().mockResolvedValue(cita);

    // Mock de pago exitoso
    pagoServiceMock.pagarCita = jest.fn().mockResolvedValue(true);

    // Llamada al servicio para confirmar la cita
    await citaService.confirmarCita(medico, cita.id);

    // Verificaciones
    expect(cita.estado).toBe("confirmada");
    expect(cita.pagado).toBe(true);
    expect(citaRepositoryMock.actualizarCita).toHaveBeenCalledWith(
      cita.id,
      expect.objectContaining({ estado: "confirmada", pagado: true })
    );
  });

  it("debería lanzar un error si el usuario no es un médico", async () => {
    // Mock de datos
    const cita = new Cita();
    cita.id = 1;
    cita.pagado = true;
    cita.monto = 100;
    cita.estado = "pendiente";

    const paciente = { id: 1, rol: "paciente" } as any; // Simulamos que es un paciente

    // Mock de la función que devuelve la cita
    citaRepositoryMock.findById = jest.fn().mockResolvedValue(cita);

    // Mock de pago exitoso
    pagoServiceMock.pagarCita = jest.fn().mockResolvedValue(true);

    // Verificamos que si el usuario no es un médico, se lance un error
    await expect(citaService.confirmarCita(paciente, cita.id)).rejects.toThrow(
      "Solo los médicos pueden confirmar citas"
    );

    // Verificación: no debe actualizarse la cita en este caso
    expect(citaRepositoryMock.actualizarCita).not.toHaveBeenCalled();
  });
});
