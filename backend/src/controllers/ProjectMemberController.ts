import { Request, Response, NextFunction } from "express";
import { ProjectMemberService } from "../services/ProjectMemberService";
import { getAuthUser } from "../auth/auth";

export class ProjectMemberController {
  constructor(private memberService: ProjectMemberService) {}

  listByProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = Number(req.params.projectId);
      const members = await this.memberService.listByProject(projectId);
      res.json(members);
    } catch (error) {
      next(error);
    }
  };

  listMyProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = getAuthUser(req);
      const projects = await this.memberService.listProjectsByUser(currentUser);
      return res.json(projects);
    } catch (error) {
      next(error);
    }
  };

  listAvailableUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = Number(req.params.projectId);
      const users = await this.memberService.listAvailableUsers(projectId, getAuthUser(req));
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  add = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = Number(req.params.projectId);
      const membership = await this.memberService.add(projectId, req.body, getAuthUser(req));
      res.status(201).json(membership);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = Number(req.params.projectId);
      const userId = Number(req.params.userId);
      const membership = await this.memberService.update(projectId, userId, req.body, getAuthUser(req));
      res.json(membership);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = Number(req.params.projectId);
      const userId = Number(req.params.userId);
      await this.memberService.delete(projectId, userId, getAuthUser(req));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
