import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Usuario } from "@modules/usuarios/usuarios.model"; // Relación con el modelo de Usuario

@Entity("citas")
export class Cita {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.citasPaciente) // Relación con el paciente
  @JoinColumn({ name: "pacienteId" })
  paciente!: Usuario; // Relación con el paciente

  @ManyToOne(() => Usuario, (usuario) => usuario.citasDoctor) // Relación con el doctor
  @JoinColumn({ name: "doctorId" })
  doctor!: Usuario; // Relación con el doctor

  @Column()
  fecha!: Date;

  @Column({ type: "text", nullable: true })
  motivo!: string;

  @Column({ default: false })
  pagado!: boolean;

  @Column({ default: "pendiente" })
  estado!: "pendiente" | "confirmada" | "cancelada";

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  monto!: number;

  @CreateDateColumn()
  creadaEn!: Date;
}
