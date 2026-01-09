import { In, Repository } from "typeorm";
import { Project } from "../models/Project";
import { Comment } from "../models/Comment";
import { Sprint } from "../models/Sprint";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { ProjectMember, ProjectRole } from "../models/ProjectMember";
import {
  AuthUser,
  ForbiddenError,
  NotFoundError,
  assertAuthenticated,
  isAdmin,
} from "./utils";

export type CreateProjectInput = {
  name: string;
  description?: string | null;
  isPublic?: boolean;
  ownerId?: number;
};

export type UpdateProjectInput = {
  name?: string;
  description?: string | null;
  isPublic?: boolean;
  ownerId?: number;
};

export class ProjectService {
  constructor(
    private projectRepo: Repository<Project>,
    private userRepo: Repository<User>,
    private memberRepo: Repository<ProjectMember>
  ) {}

  async listPublicProjects(): Promise<Project[]> {
    return this.projectRepo.find({ where: { isPublic: true } });
  }

  async listAccessibleProjects(currentUser?: AuthUser): Promise<Project[]> {
    if (!currentUser) {
      return this.listPublicProjects();
    }

    if (isAdmin(currentUser)) {
      return this.projectRepo.find();
    }

    const memberships = await this.memberRepo.find({
      where: { userId: currentUser.id },
    });
    const memberProjectIds = memberships.map((member) => member.projectId);

    const where = [{ isPublic: true }, { ownerId: currentUser.id }];
    if (memberProjectIds.length) {
      where.push({ id: In(memberProjectIds) });
    }

    return this.projectRepo.find({ where });
  }

  async getById(id: number, currentUser?: AuthUser): Promise<Project> {
    const project = await this.projectRepo.findOneBy({ id });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (project.isPublic) {
      return project;
    }

    if (!currentUser) {
      throw new ForbiddenError("Authentication required");
    }

    if (isAdmin(currentUser) || project.ownerId === currentUser.id) {
      return project;
    }

    const membership = await this.memberRepo.findOneBy({
      projectId: project.id,
      userId: currentUser.id,
    });
    if (!membership) {
      throw new ForbiddenError("You do not have access to this project");
    }

    return project;
  }

  async createProject(
    input: CreateProjectInput,
    currentUser?: AuthUser
  ): Promise<Project> {
    assertAuthenticated(currentUser);

    let ownerId = currentUser.id;
    if (input.ownerId !== undefined) {
      if (!isAdmin(currentUser)) {
        throw new ForbiddenError("Only admin can set project owner");
      }
      ownerId = input.ownerId;
    }

    const owner = await this.userRepo.findOneBy({ id: ownerId });
    if (!owner) {
      throw new NotFoundError("Owner user not found");
    }

    const project = this.projectRepo.create({
      name: input.name,
      description: input.description ?? null,
      isPublic: input.isPublic ?? false,
      owner,
      ownerId: owner.id,
    });

    const savedProject = await this.projectRepo.save(project);

    const membership = this.memberRepo.create({
      projectId: savedProject.id,
      userId: owner.id,
      role: ProjectRole.Admin,
    });
    await this.memberRepo.save(membership);

    return savedProject;
  }

  async updateProject(
    id: number,
    input: UpdateProjectInput,
    currentUser?: AuthUser
  ): Promise<Project> {
    assertAuthenticated(currentUser);

    const project = await this.projectRepo.findOneBy({ id });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    await this.assertCanManageProject(project.id, currentUser);

    if (input.ownerId !== undefined) {
      if (!isAdmin(currentUser)) {
        throw new ForbiddenError("Only admin can change project owner");
      }

      const newOwner = await this.userRepo.findOneBy({ id: input.ownerId });
      if (!newOwner) {
        throw new NotFoundError("Owner user not found");
      }
      project.ownerId = newOwner.id;
      project.owner = newOwner;
    }

    if (input.name !== undefined) project.name = input.name;
    if (input.description !== undefined) project.description = input.description;
    if (input.isPublic !== undefined) project.isPublic = input.isPublic;

    return this.projectRepo.save(project);
  }

  async deleteProject(id: number, currentUser?: AuthUser): Promise<void> {
    assertAuthenticated(currentUser);

    const project = await this.projectRepo.findOneBy({ id });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    await this.assertCanManageProject(project.id, currentUser);

    await this.projectRepo.manager.transaction(async (trx) => {
      const taskRepo = trx.getRepository(Task);
      const sprintRepo = trx.getRepository(Sprint);
      const commentRepo = trx.getRepository(Comment);
      const memberRepo = trx.getRepository(ProjectMember);

      const taskIds = await taskRepo.find({
        select: { id: true },
        where: { projectId: project.id },
      });
      const taskIdList = taskIds.map((task) => task.id);

      if (taskIdList.length) {
        await commentRepo.delete({ taskId: In(taskIdList) });
      }

      await taskRepo.delete({ projectId: project.id });
      await sprintRepo.delete({ projectId: project.id });
      await memberRepo.delete({ projectId: project.id });
      await trx.getRepository(Project).delete({ id: project.id });
    });
  }

  private async assertCanManageProject(
    projectId: number,
    currentUser: AuthUser
  ) {
    if (isAdmin(currentUser)) {
      return;
    }

    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (project.ownerId === currentUser.id) {
      return;
    }

    const membership = await this.memberRepo.findOneBy({
      projectId,
      userId: currentUser.id,
    });

    if (!membership) {
      throw new ForbiddenError("You do not have access to this project");
    }

    if (membership.role !== ProjectRole.Admin && membership.role !== ProjectRole.Manager) {
      throw new ForbiddenError("Manager or admin access required");
    }
  }
}
