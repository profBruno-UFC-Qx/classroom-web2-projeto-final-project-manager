import { Request, Response, NextFunction } from "express";
import { SprintService } from "../services/SprintService";
import { getAuthUser } from "../auth/auth";

export class SprintController {
  constructor(private sprintService: SprintService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = Number(req.query.projectId);
      if (!Number.isFinite(projectId)) {
        res.status(400).json({ message: "projectId is required" });
        return;
      }

      const sprints = await this.sprintService.listByProject(
        projectId,
        getAuthUser(req)
      );
      res.json(sprints);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const sprint = await this.sprintService.getById(id, getAuthUser(req));
      res.json(sprint);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sprint = await this.sprintService.createSprint(
        req.body,
        getAuthUser(req)
      );
      res.status(201).json(sprint);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const sprint = await this.sprintService.updateSprint(
        id,
        req.body,
        getAuthUser(req)
      );
      res.json(sprint);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.sprintService.deleteSprint(id, getAuthUser(req));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
