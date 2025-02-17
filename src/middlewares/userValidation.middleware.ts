import {
  userLoginSchema,
  userRegisterSchema,
} from "@utils/schemas/auth.schemas";
import { Request, Response, NextFunction } from "express";

export const validateRegisterUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = userRegisterSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  next();
};

export const validateLoginUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  next();
};
