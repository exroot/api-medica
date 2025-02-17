import Joi from "joi";

export const citaSchema = Joi.object({
  pacienteId: Joi.number().integer().required(), // ID del paciente (clave foránea)
  doctorId: Joi.number().integer().required(), // ID del doctor (clave foránea)
  fecha: Joi.date().iso().required(), // Fecha en formato ISO 8601
  motivo: Joi.string().allow(null, ""), // Motivo (puede ser nulo o vacío)
});
