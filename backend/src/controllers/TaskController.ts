import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/TaskService";
import { getAuthUser } from "../auth/auth";

export class TaskController {
  constructor(private taskService: TaskService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sprintId = Number(req.query.sprintId);
      if (Number.isFinite(sprintId)) {
        const tasks = await this.taskService.listBySprint(
          sprintId,
          getAuthUser(req)
        );
        res.json(tasks);
        return;
      }

      const projectId = Number(req.query.projectId);
      if (!Number.isFinite(projectId)) {
        res.status(400).json({ message: "projectId or sprintId is required" });
        return;
      }

      const tasks = await this.taskService.listByProject(
        projectId,
        getAuthUser(req)
      );
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const task = await this.taskService.getById(id, getAuthUser(req));
      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.createTask(
        req.body,
        getAuthUser(req)
      );
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const task = await this.taskService.updateTask(
        id,
        req.body,
        getAuthUser(req)
      );
      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.taskService.deleteTask(id, getAuthUser(req));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
