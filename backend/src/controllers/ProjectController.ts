import { Request, Response, NextFunction } from "express";
import { ProjectService } from "../services/ProjectService";
import { getAuthUser } from "../auth/auth";
import { parsePagination } from "../http/pagination";

export class ProjectController {
  constructor(private projectService: ProjectService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pagination, error } = parsePagination(req.query);
      if (error) {
        res.status(400).json({ message: error });
        return;
      }

      const name =
        typeof req.query.name === "string" ? req.query.name : undefined;
      const projects = await this.projectService.listAccessibleProjects(
        getAuthUser(req),
        { pagination, name }
      );
      res.json(projects);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const project = await this.projectService.getById(id, getAuthUser(req));
      res.json(project);
    } catch (error) {
      next(error);
    }
  };

  listMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { pagination, error } = parsePagination(req.query);
      if (error) {
        res.status(400).json({ message: error });
        return;
      }

      const members = await this.projectService.listMembers(
        id,
        getAuthUser(req),
        pagination
      );
      res.json(members);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.projectService.createProject(
        req.body,
        getAuthUser(req)
      );
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const project = await this.projectService.updateProject(
        id,
        req.body,
        getAuthUser(req)
      );
      res.json(project);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.projectService.deleteProject(id, getAuthUser(req));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
