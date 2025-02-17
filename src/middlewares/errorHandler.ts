//  Middleware global para manejo de errores en la API.
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  const statusCode = err.status || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({ error: message });
};
