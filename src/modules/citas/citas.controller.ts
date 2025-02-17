import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { CitaService } from "@modules/citas/citas.service";
import { AuthRequest } from "@modules/auth/auth.middleware";
import { RolUsuario } from "@modules/usuarios/usuarios.model";
import TYPES from "@config/types";

@injectable()
export class CitaController {
  private citaService: CitaService;
  constructor(@inject(TYPES.CitaService) citaService: CitaService) {
    this.citaService = citaService;
  }

  agendarCita = async (req: AuthRequest, res: Response) => {
    try {
      const { fecha, motivo, doctorId } = req.body;
      const usuarioId = req.user.id; // Obtenemos el ID del usuario autenticado

      const cita = await this.citaService.agendarCita(
        usuarioId,
        doctorId,
        fecha,
        motivo
      );
      res.status(201).json(cita);
    } catch (error) {
      res.status(400).json({ message: "Error al agendar la cita", error });
    }
  };

  listarCitasUsuario = async (req: AuthRequest, res: Response) => {
    try {
      const usuarioId = req.user.id;
      const rol = req.user.rol; // Asumiendo que el rol está en el payload del JWT

      let citas;
      if (rol === RolUsuario.PACIENTE) {
        citas = await this.citaService.listarCitasComoPaciente(usuarioId);
      } else if (rol === RolUsuario.MEDICO) {
        citas = await this.citaService.listarCitasComoDoctor(usuarioId);
      } else {
        res
          .status(403)
          .json({ message: "Rol no autorizado para listar citas." });
        return;
      }
      res.json(citas);
    } catch (error) {
      res.status(400).json({ message: "Error al obtener citas", error });
    }
  };

  modificarCita = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const datos = req.body;

      const citaActualizada = await this.citaService.modificarCita(
        Number(id),
        datos
      );

      if (!citaActualizada) {
        res.status(404).json({ message: "Cita no encontrada" });
        return;
      }

      res.json(citaActualizada);
    } catch (error) {
      res.status(400).json({ message: "Error al modificar la cita", error });
    }
  };

  cancelarCita = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.citaService.cancelarCita(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Error al cancelar la cita", error });
    }
  };
}
