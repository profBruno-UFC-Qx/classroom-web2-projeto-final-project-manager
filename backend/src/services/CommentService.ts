import { Repository } from "typeorm";
import { Comment } from "../models/Comment";
import { Task } from "../models/Task";
import { Project } from "../models/Project";
import { ProjectMember } from "../models/ProjectMember";
import {
  AuthUser,
  ForbiddenError,
  NotFoundError,
  assertAuthenticated,
  isAdmin,
} from "./utils";

export type CreateCommentInput = {
  taskId: number;
  content: string;
};

export type UpdateCommentInput = {
  content: string;
};

export class CommentService {
  constructor(
    private commentRepo: Repository<Comment>,
    private taskRepo: Repository<Task>,
    private projectRepo: Repository<Project>,
    private memberRepo: Repository<ProjectMember>
  ) {}

  private async assertCanViewTask(task: Task, currentUser?: AuthUser) {
    const project = await this.projectRepo.findOneBy({ id: task.projectId });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (project.isPublic) {
      return;
    }

    if (!currentUser) {
      throw new ForbiddenError("Authentication required");
    }

    if (isAdmin(currentUser) || project.ownerId === currentUser.id) {
      return;
    }

    const membership = await this.memberRepo.findOneBy({
      projectId: project.id,
      userId: currentUser.id,
    });
    if (membership) {
      return;
    }

    if (task.assigneeId === currentUser.id) {
      return;
    }

    throw new ForbiddenError("You do not have access to this task");
  }

  async listByTask(
    taskId: number,
    currentUser?: AuthUser
  ): Promise<Comment[]> {
    const task = await this.taskRepo.findOneBy({ id: taskId });
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    await this.assertCanViewTask(task, currentUser);
    return this.commentRepo.find({ where: { taskId } });
  }

  async getById(id: number, currentUser?: AuthUser): Promise<Comment> {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    const task = await this.taskRepo.findOneBy({ id: comment.taskId });
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    await this.assertCanViewTask(task, currentUser);
    return comment;
  }

  async createComment(
    input: CreateCommentInput,
    currentUser?: AuthUser
  ): Promise<Comment> {
    assertAuthenticated(currentUser);

    const task = await this.taskRepo.findOneBy({ id: input.taskId });
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    const comment = this.commentRepo.create({
      content: input.content,
      taskId: task.id,
      authorId: currentUser.id,
    });

    return this.commentRepo.save(comment);
  }

  async updateComment(
    id: number,
    input: UpdateCommentInput,
    currentUser?: AuthUser
  ): Promise<Comment> {
    assertAuthenticated(currentUser);

    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    if (!isAdmin(currentUser) && comment.authorId !== currentUser.id) {
      throw new ForbiddenError("You can only update your own comments");
    }

    comment.content = input.content;
    return this.commentRepo.save(comment);
  }

  async deleteComment(id: number, currentUser?: AuthUser): Promise<void> {
    assertAuthenticated(currentUser);

    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    if (!isAdmin(currentUser) && comment.authorId !== currentUser.id) {
      throw new ForbiddenError("You can only delete your own comments");
    }

    await this.commentRepo.remove(comment);
  }
}
