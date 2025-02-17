import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { PagoService } from "@modules/pagos/pago.service";
import TYPES from "@config/types";

@injectable()
export class PagoController {
  constructor(
    @inject(TYPES.PagoService) private readonly pagoService: PagoService
  ) {}

  // Controlador para procesar el pago de una cita
  pagarCita = async (req: Request, res: Response) => {
    try {
      const { monto, pacienteId } = req.body; // Extraer los datos del cuerpo de la solicitud
      const pagoExitoso = await this.pagoService.pagarCita(monto, pacienteId);

      if (!pagoExitoso) {
        res.status(400).json({ message: "Pago no procesado correctamente" });
        return;
      }

      res.status(200).json({ message: "Pago procesado exitosamente" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error en el procesamiento del pago", error });
    }
  };

  // Controlador para obtener detalles del pago
  obtenerPago = async (req: Request, res: Response) => {
    try {
      const { pagoId } = req.params; // Obtener el ID del pago desde los parámetros de la URL
      const pago = await this.pagoService.obtenerPago(pagoId);

      if (!pago) {
        return res.status(404).json({ message: "Pago no encontrado" });
      }

      res.status(200).json({ pago });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los detalles del pago", error });
    }
  };
}
