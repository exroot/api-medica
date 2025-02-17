import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "@config/env"; // Configuración con la clave secreta JWT

export interface AuthRequest extends Request {
  user?: any; // Agregando el usuario autenticado a la request
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Acceso no autorizado. Token requerido." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as {
      id: number;
      email: string;
    };
    req.user = decoded;
    next(); // 🔹 Continuar ejecución
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado." });
    return;
  }
};
