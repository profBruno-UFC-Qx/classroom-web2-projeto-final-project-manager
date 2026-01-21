import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
} from "typeorm";
import { User } from "./User";
import { Project } from "./Project";

export enum ProjectRole {
  Admin = "admin",
  Manager = "manager",
  Member = "member",
}

@Entity("project_members")
@Unique(["projectId", "userId"])
export class ProjectMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Project, (project) => project.members, { nullable: false })
  @JoinColumn({ name: "projectId" })
  project!: Project;

  @Column({ type: "integer" })
  projectId!: number;

  @ManyToOne(() => User, (user) => user.memberships, { nullable: false })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "integer" })
  userId!: number;

  @Column({ type: "text", default: ProjectRole.Member })
  role!: ProjectRole;

  @CreateDateColumn()
  createdAt!: Date;
}
