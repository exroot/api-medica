-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS api_medica;

-- Seleccionar la base de datos
USE api_medica;

-- Crear la tabla 'citas'
CREATE TABLE IF NOT EXISTS `citas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL,
  `motivo` text NULL,
  `pagado` tinyint NOT NULL DEFAULT 0,
  `estado` varchar(255) NOT NULL DEFAULT 'pendiente',
  `monto` decimal(10,2) NOT NULL DEFAULT '0.00',
  `creadaEn` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `pacienteId` int NULL,
  `doctorId` int NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Crear la tabla 'usuarios'
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `rol` enum('paciente', 'medico') NOT NULL DEFAULT 'paciente',
  `password` varchar(255) NOT NULL,
  `activo` tinyint NOT NULL DEFAULT 1,
  `creadoEn` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizadoEn` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX `IDX_446adfc18b35418aac32ae0b7b` (`email`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
