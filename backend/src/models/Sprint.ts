import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Project } from "./Project";
import { Task } from "./Task";

@Entity("sprints")
export class Sprint {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120 })
  name!: string;

  @Column({ type: "date", nullable: true })
  startDate?: string | null;

  @Column({ type: "date", nullable: true })
  endDate?: string | null;

  @ManyToOne(() => Project, (project) => project.sprints, { nullable: false })
  @JoinColumn({ name: "projectId" })
  project!: Project;

  @Column({ type: "integer" })
  projectId!: number;

  @OneToMany(() => Task, (task) => task.sprint)
  tasks!: Task[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
