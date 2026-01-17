import { Repository } from "typeorm";
import { Task } from "../models/Task";
import { Project } from "../models/Project";
import { Sprint } from "../models/Sprint";
import { User } from "../models/User";
import { ProjectMember, ProjectRole } from "../models/ProjectMember";
import {
  AuthUser,
  BadRequestError,
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
  sprintId: number;
  assigneeId?: number | null;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  status?: string;
  priority?: string;
  dueDate?: string | null;
  sprintId?: number;
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

  private async getProjectForSprint(sprintId: number) {
    const sprint = await this.sprintRepo.findOneBy({ id: sprintId });
    if (!sprint) {
      throw new NotFoundError("Sprint not found");
    }

    const project = await this.projectRepo.findOneBy({ id: sprint.projectId });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    return { sprint, project };
  }

  private async getProjectForTask(task: Task) {
    if (!task.sprintId) {
      throw new BadRequestError("Task has no sprint");
    }

    const { project } = await this.getProjectForSprint(task.sprintId);
    return project;
  }

  private async validateAssignee(assigneeId: number) {
    const assignee = await this.userRepo.findOneBy({ id: assigneeId });
    if (!assignee) {
      throw new NotFoundError("Assignee user not found");
    }
  }

  async listBySprint(
    sprintId: number,
    currentUser?: AuthUser
  ): Promise<Task[]> {
    const { project } = await this.getProjectForSprint(sprintId);
    const baseWhere = { sprintId };

    const baseQuery = {
      where: baseWhere,
      relations: {
        assignee: true,
      },
    };

    if (project.isPublic) {
      return this.taskRepo.find(baseQuery);
    }

    if (!currentUser) {
      throw new ForbiddenError("Authentication required");
    }

    if (isAdmin(currentUser) || project.ownerId === currentUser.id) {
      return this.taskRepo.find(baseQuery);
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
        relations: {
          assignee: true,
        },
      });
    }

    return this.taskRepo.find(baseQuery);
  }

  async getById(id: number, currentUser?: AuthUser): Promise<Task> {
    const task = await this.taskRepo.findOne({ 
      where: { id },
      relations: ["assignee"],
    });

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    const project = await this.getProjectForTask(task);

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

    if (!input.title || input.title.trim().length === 0) {
      throw new BadRequestError("Task title is required");
    }

    const { sprint, project } = await this.getProjectForSprint(input.sprintId);
    if (!project.isPublic) {
      await this.assertCanManageProject(project.id, currentUser);
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
      sprint,
      sprintId: sprint.id,
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

    const currentProject = await this.getProjectForTask(task);
    if (currentProject.isPublic) {
      if (input.title !== undefined && input.title.trim().length === 0) {
        throw new BadRequestError("Task title is required");
      }

      if (input.assigneeId !== undefined && input.assigneeId !== null) {
        await this.validateAssignee(input.assigneeId);
      }

      if (input.sprintId !== undefined) {
        const { project: nextProject } = await this.getProjectForSprint(input.sprintId);
        if (nextProject.id !== currentProject.id) {
          throw new ForbiddenError("Sprint does not belong to the project");
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
    const membership = await this.memberRepo.findOneBy({
      projectId: currentProject.id,
      userId: currentUser.id,
    });

    if (!isAdmin(currentUser) && !membership && task.assigneeId !== currentUser.id) {
      throw new ForbiddenError("You do not have access to this task");
    }

    if (membership?.role === ProjectRole.Member || (!membership && task.assigneeId === currentUser.id)) {
      if (input.title !== undefined && input.title.trim().length === 0) {
        throw new BadRequestError("Task title is required");
      }

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
      await this.assertCanManageProject(currentProject.id, currentUser);

      if (input.title !== undefined && input.title.trim().length === 0) {
        throw new BadRequestError("Task title is required");
      }

      if (input.sprintId !== undefined) {
        const { project: nextProject } = await this.getProjectForSprint(input.sprintId);
        if (nextProject.id !== currentProject.id) {
          throw new ForbiddenError("Sprint does not belong to the project");
        }
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

    const project = await this.getProjectForTask(task);
    if (!project.isPublic) {
      await this.assertCanManageProject(project.id, currentUser);
    }
    await this.taskRepo.remove(task);
  }
}
