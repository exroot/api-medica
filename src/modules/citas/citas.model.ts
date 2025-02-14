import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Usuario } from "modules/usuarios/usuarios.model"; // Relación con Usuarios

@Entity("citas")
export class Cita {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.citas)
  @JoinColumn({ name: "usuarioId" }) // Define la clave foránea
  usuario!: Usuario; // Relación con Usuario

  @Column()
  fecha!: Date;

  @Column({ type: "text", nullable: true })
  motivo!: string;

  @Column({ default: "pendiente" })
  estado!: "pendiente" | "confirmada" | "cancelada";

  @CreateDateColumn()
  creadaEn!: Date;
}
