import { Repository } from "typeorm";
import { Task } from "../models/Task";
import { Project } from "../models/Project";
import { Sprint } from "../models/Sprint";
import { User } from "../models/User";
import { ProjectMember, ProjectRole } from "../models/ProjectMember";
import {
  AuthUser,
  ForbiddenError,
  NotFoundError,
  assertAuthenticated,
  isAdmin,
} from "./utils";

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  status?: string;
  priority?: string;
  dueDate?: string | null;
  projectId: number;
  sprintId?: number | null;
  assigneeId?: number | null;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  status?: string;
  priority?: string;
  dueDate?: string | null;
  sprintId?: number | null;
  assigneeId?: number | null;
};

export class TaskService {
  constructor(
    private taskRepo: Repository<Task>,
    private projectRepo: Repository<Project>,
    private sprintRepo: Repository<Sprint>,
    private userRepo: Repository<User>,
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

  private async validateSprint(projectId: number, sprintId: number) {
    const sprint = await this.sprintRepo.findOneBy({ id: sprintId });
    if (!sprint) {
      throw new NotFoundError("Sprint not found");
    }
    if (sprint.projectId !== projectId) {
      throw new ForbiddenError("Sprint does not belong to the project");
    }
  }

  private async validateAssignee(assigneeId: number) {
    const assignee = await this.userRepo.findOneBy({ id: assigneeId });
    if (!assignee) {
      throw new NotFoundError("Assignee user not found");
    }
  }

  async listByProject(
    projectId: number,
    currentUser?: AuthUser
  ): Promise<Task[]> {
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (project.isPublic) {
      return this.taskRepo.find({ where: { projectId } });
    }

    if (!currentUser) {
      throw new ForbiddenError("Authentication required");
    }

    if (isAdmin(currentUser) || project.ownerId === currentUser.id) {
      return this.taskRepo.find({ where: { projectId } });
    }

    const membership = await this.memberRepo.findOneBy({
      projectId,
      userId: currentUser.id,
    });
    if (!membership) {
      throw new ForbiddenError("You do not have access to this project");
    }

    if (membership.role === ProjectRole.Member) {
      return this.taskRepo.find({
        where: { projectId, assigneeId: currentUser.id },
      });
    }

    return this.taskRepo.find({ where: { projectId } });
  }

  async listBySprint(
    sprintId: number,
    currentUser?: AuthUser
  ): Promise<Task[]> {
    const sprint = await this.sprintRepo.findOneBy({ id: sprintId });
    if (!sprint) {
      throw new NotFoundError("Sprint not found");
    }

    const project = await this.projectRepo.findOneBy({ id: sprint.projectId });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    const baseWhere = { projectId: project.id, sprintId };

    if (project.isPublic) {
      return this.taskRepo.find({ where: baseWhere });
    }

    if (!currentUser) {
      throw new ForbiddenError("Authentication required");
    }

    if (isAdmin(currentUser) || project.ownerId === currentUser.id) {
      return this.taskRepo.find({ where: baseWhere });
    }

    const membership = await this.memberRepo.findOneBy({
      projectId: project.id,
      userId: currentUser.id,
    });
    if (!membership) {
      throw new ForbiddenError("You do not have access to this project");
    }

    if (membership.role === ProjectRole.Member) {
      return this.taskRepo.find({
        where: { ...baseWhere, assigneeId: currentUser.id },
      });
    }

    return this.taskRepo.find({ where: baseWhere });
  }

  async getById(id: number, currentUser?: AuthUser): Promise<Task> {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    const project = await this.projectRepo.findOneBy({ id: task.projectId });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (project.isPublic) {
      return task;
    }

    if (!currentUser) {
      throw new ForbiddenError("Authentication required");
    }

    if (isAdmin(currentUser) || project.ownerId === currentUser.id) {
      return task;
    }

    const membership = await this.memberRepo.findOneBy({
      projectId: project.id,
      userId: currentUser.id,
    });
    if (!membership) {
      throw new ForbiddenError("You do not have access to this project");
    }

    if (membership.role === ProjectRole.Member && task.assigneeId !== currentUser.id) {
      throw new ForbiddenError("You can only view your own tasks");
    }

    return task;
  }

  async createTask(
    input: CreateTaskInput,
    currentUser?: AuthUser
  ): Promise<Task> {
    assertAuthenticated(currentUser);

    const project = await this.assertCanManageProject(input.projectId, currentUser);

    if (input.sprintId) {
      await this.validateSprint(project.id, input.sprintId);
    }
    if (input.assigneeId) {
      await this.validateAssignee(input.assigneeId);
    }

    const task = this.taskRepo.create({
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? "todo",
      priority: input.priority ?? "medium",
      dueDate: input.dueDate ?? null,
      project,
      projectId: project.id,
      sprintId: input.sprintId ?? null,
      assigneeId: input.assigneeId ?? null,
    });

    return this.taskRepo.save(task);
  }

  async updateTask(
    id: number,
    input: UpdateTaskInput,
    currentUser?: AuthUser
  ): Promise<Task> {
    assertAuthenticated(currentUser);

    const task = await this.taskRepo.findOneBy({ id });
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    const membership = await this.memberRepo.findOneBy({
      projectId: task.projectId,
      userId: currentUser.id,
    });

    if (!isAdmin(currentUser) && !membership && task.assigneeId !== currentUser.id) {
      throw new ForbiddenError("You do not have access to this task");
    }

    if (membership?.role === ProjectRole.Member || (!membership && task.assigneeId === currentUser.id)) {
      if (task.assigneeId !== currentUser.id) {
        throw new ForbiddenError("You can only update your own tasks");
      }

      const allowedKeys = ["status"];
      const requestedKeys = Object.keys(input).filter(
        (key) => (input as Record<string, unknown>)[key] !== undefined
      );
      const invalidKey = requestedKeys.find((key) => !allowedKeys.includes(key));
      if (invalidKey) {
        throw new ForbiddenError("Members can only update task status");
      }
    } else {
      await this.assertCanManageProject(task.projectId, currentUser);

      if (input.sprintId !== undefined && input.sprintId !== null) {
        await this.validateSprint(task.projectId, input.sprintId);
      }
      if (input.assigneeId !== undefined && input.assigneeId !== null) {
        await this.validateAssignee(input.assigneeId);
      }
    }

    if (input.title !== undefined) task.title = input.title;
    if (input.description !== undefined) task.description = input.description;
    if (input.status !== undefined) task.status = input.status;
    if (input.priority !== undefined) task.priority = input.priority;
    if (input.dueDate !== undefined) task.dueDate = input.dueDate;
    if (input.sprintId !== undefined) task.sprintId = input.sprintId;
    if (input.assigneeId !== undefined) task.assigneeId = input.assigneeId;

    return this.taskRepo.save(task);
  }

  async deleteTask(id: number, currentUser?: AuthUser): Promise<void> {
    assertAuthenticated(currentUser);

    const task = await this.taskRepo.findOneBy({ id });
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    await this.assertCanManageProject(task.projectId, currentUser);
    await this.taskRepo.remove(task);
  }
}
