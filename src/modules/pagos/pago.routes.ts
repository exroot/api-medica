import { Router } from "express";
import { inject, injectable } from "inversify";
import { PagoController } from "@modules/pagos/pago.controller"; // Importa el controlador de pagos
import { authMiddleware } from "@modules/auth/auth.middleware"; // Middleware de autenticación
import { validarPago } from "@modules/pagos/pago.middleware"; // Middleware de validacion de pagos
import TYPES from "@config/types"; // Asegúrate de tener un tipo para el controlador

@injectable()
export class PagoRoutes {
  public router: Router;
  private pagoController: PagoController;

  constructor(
    @inject(TYPES.PagoController) // Inyecta el controlador de pago
    pagoController: PagoController
  ) {
    this.pagoController = pagoController;
    this.router = Router();
    this.initializeRoutes(); // Inicializa las rutas
  }

  private initializeRoutes() {
    // Ruta para procesar el pago de una cita
    this.router.post(
      "/pagar-cita",
      authMiddleware, // Aplica el middleware de autenticación
      validarPago,
      this.pagoController.pagarCita // Llama al método del controlador
    );
  }
}
