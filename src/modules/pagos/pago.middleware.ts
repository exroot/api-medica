import { Request, Response, NextFunction } from "express";

export function validarPago(req: Request, res: Response, next: NextFunction) {
  const { monto, pacienteId } = req.body;

  if (typeof monto !== "number" || monto <= 0) {
    res.status(400).json({ error: "Monto inválido" });
    return;
  }

  if (!pacienteId) {
    res.status(400).json({ error: "Paciente ID es necesario" });
    return;
  }

  next(); // Si todo está bien, continua al siguiente middleware o controlador
}
