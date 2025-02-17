import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Cita } from "@modules/citas/citas.model"; // Relación con el modelo de citas

export enum RolUsuario {
  PACIENTE = "paciente",
  MEDICO = "medico",
}

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  nombre!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @OneToMany(() => Cita, (cita) => cita.paciente) // Relación con citas del paciente
  citasPaciente!: Cita[];

  @OneToMany(() => Cita, (cita) => cita.doctor) // Relación con citas del doctor
  citasDoctor!: Cita[];

  @Column({ type: "enum", enum: RolUsuario, default: RolUsuario.PACIENTE })
  rol!: RolUsuario;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  creadoEn!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  actualizadoEn!: Date;
}
