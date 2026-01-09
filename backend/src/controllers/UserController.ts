import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";
import { getAuthUser } from "../auth/auth";

export class UserController {
  constructor(private userService: UserService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body, getAuthUser(req));
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.listAll(getAuthUser(_req));
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = await this.userService.getById(id, getAuthUser(req));
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = await this.userService.updateUser(id, req.body, getAuthUser(req));
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.userService.deleteUser(id, getAuthUser(req));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
