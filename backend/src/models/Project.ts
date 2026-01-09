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
import { User } from "./User";
import { Task } from "./Task";
import { Sprint } from "./Sprint";
import { ProjectMember } from "./ProjectMember";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 140 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ type: "boolean", default: false })
  isPublic!: boolean;

  @ManyToOne(() => User, (user) => user.projects, { nullable: false })
  @JoinColumn({ name: "ownerId" })
  owner!: User;

  @Column({ type: "integer" })
  ownerId!: number;

  @OneToMany(() => Sprint, (sprint) => sprint.project)
  sprints!: Sprint[];

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];

  @OneToMany(() => ProjectMember, (membership) => membership.project)
  members!: ProjectMember[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
