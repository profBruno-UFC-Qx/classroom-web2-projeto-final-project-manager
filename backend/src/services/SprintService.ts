import { In, Repository } from "typeorm";
import { Sprint } from "../models/Sprint";
import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { Comment } from "../models/Comment";
import { ProjectMember, ProjectRole } from "../models/ProjectMember";
import {
  AuthUser,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  assertAuthenticated,
  isAdmin,
} from "./utils";

export type CreateSprintInput = {
  name: string;
  startDate?: string | null;
  endDate?: string | null;
  projectId: number;
};

export type UpdateSprintInput = {
  name?: string;
  startDate?: string | null;
  endDate?: string | null;
};

export class SprintService {
  constructor(
    private sprintRepo: Repository<Sprint>,
    private projectRepo: Repository<Project>,
    private memberRepo: Repository<ProjectMember>
  ) {}

  private async assertCanManageProject(
    projectId: number,
    currentUser: AuthUser
  ): Promise<Project> {
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (isAdmin(currentUser) || project.ownerId === currentUser.id) {
      return project;
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

    return project;
  }

  private async assertCanViewProject(
    projectId: number,
    currentUser?: AuthUser
  ): Promise<Project> {
    const project = await this.projectRepo.findOneBy({ id: projectId });
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
      projectId,
      userId: currentUser.id,
    });
    if (!membership) {
      throw new ForbiddenError("You do not have access to this project");
    }

    return project;
  }

  async listByProject(
    projectId: number,
    currentUser?: AuthUser
  ): Promise<Sprint[]> {
    await this.assertCanViewProject(projectId, currentUser);

    return this.sprintRepo.find({ where: { projectId } });
  }

  async getById(id: number, currentUser?: AuthUser): Promise<Sprint> {
    const sprint = await this.sprintRepo.findOneBy({ id });
    if (!sprint) {
      throw new NotFoundError("Sprint not found");
    }

    await this.assertCanViewProject(sprint.projectId, currentUser);
    return sprint;
  }

  async createSprint(
    input: CreateSprintInput,
    currentUser?: AuthUser
  ): Promise<Sprint> {
    assertAuthenticated(currentUser);

    if (!input.name || input.name.trim().length === 0) {
      throw new BadRequestError("Sprint name is required");
    }

    const project = await this.projectRepo.findOneBy({ id: input.projectId });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (!project.isPublic) {
      await this.assertCanManageProject(project.id, currentUser);
    }

    const sprint = this.sprintRepo.create({
      name: input.name,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
      project,
      projectId: project.id,
    });

    return this.sprintRepo.save(sprint);
  }

  async updateSprint(
    id: number,
    input: UpdateSprintInput,
    currentUser?: AuthUser
  ): Promise<Sprint> {
    assertAuthenticated(currentUser);

    const sprint = await this.sprintRepo.findOneBy({ id });
    if (!sprint) {
      throw new NotFoundError("Sprint not found");
    }

    const project = await this.projectRepo.findOneBy({ id: sprint.projectId });
    if (!project) {
      throw new NotFoundError("Project not found");
    }
    if (!project.isPublic) {
      await this.assertCanManageProject(project.id, currentUser);
    }

    if (input.name !== undefined) {
      if (!input.name || input.name.trim().length === 0) {
        throw new BadRequestError("Sprint name is required");
      }
      sprint.name = input.name;
    }
    if (input.startDate !== undefined) sprint.startDate = input.startDate;
    if (input.endDate !== undefined) sprint.endDate = input.endDate;

    return this.sprintRepo.save(sprint);
  }
  async deleteSprint(id: number, currentUser?: AuthUser): Promise<void> {
  assertAuthenticated(currentUser);

  const sprint = await this.sprintRepo.findOneBy({ id });
  if (!sprint) {
    throw new NotFoundError("Sprint not found");
  }

  const project = await this.projectRepo.findOneBy({ id: sprint.projectId });
  if (!project) {
    throw new NotFoundError("Project not found");
  }
  if (!project.isPublic) {
    await this.assertCanManageProject(project.id, currentUser);
  }

  await this.sprintRepo.manager.transaction(async (trx) => {
      const taskRepo = trx.getRepository(Task);
      const commentRepo = trx.getRepository(Comment);
      const sprintRepo = trx.getRepository(Sprint);

      const taskIds = await taskRepo.find({
        select: { id: true },
        where: { sprintId: sprint.id },
      });

      const taskIdList = taskIds.map(task => task.id);

      if (taskIdList.length) {
        await commentRepo.delete({
          taskId: In(taskIdList),
        });
      }

      await taskRepo.delete({ sprintId: sprint.id });
      await sprintRepo.delete({ id: sprint.id });
    });
  }
}

