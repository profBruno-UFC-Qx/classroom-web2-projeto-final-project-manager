import { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/CommentService";
import { getAuthUser } from "../auth/auth";

export class CommentController {
  constructor(private commentService: CommentService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = Number(req.query.taskId);
      if (!Number.isFinite(taskId)) {
        res.status(400).json({ message: "taskId is required" });
        return;
      }

      const comments = await this.commentService.listByTask(
        taskId,
        getAuthUser(req)
      );
      res.json(comments);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const comment = await this.commentService.getById(id, getAuthUser(req));
      res.json(comment);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await this.commentService.createComment(
        req.body,
        getAuthUser(req)
      );
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const comment = await this.commentService.updateComment(
        id,
        req.body,
        getAuthUser(req)
      );
      res.json(comment);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.commentService.deleteComment(id, getAuthUser(req));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
