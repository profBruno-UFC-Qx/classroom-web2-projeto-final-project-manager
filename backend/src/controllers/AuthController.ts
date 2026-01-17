import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { getAuthUser } from "../auth/auth";
import { User } from "../models/User";
import { AppDataSource } from "../data-source";

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  
  logout = (_req: Request, res: Response) => {
    res.status(204).send();
  };
}
