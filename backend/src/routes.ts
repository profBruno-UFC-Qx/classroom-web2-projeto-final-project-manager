import { Router } from "express";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import { Project } from "./models/Project";
import { Sprint } from "./models/Sprint";
import { Task } from "./models/Task";
import { Comment } from "./models/Comment";
import { ProjectMember } from "./models/ProjectMember";
import { UserService } from "./services/UserService";
import { ProjectService } from "./services/ProjectService";
import { SprintService } from "./services/SprintService";
import { TaskService } from "./services/TaskService";
import { ProjectMemberService } from "./services/ProjectMemberService";
import { CommentService } from "./services/CommentService";
import { AuthService } from "./services/AuthService";
import { UserController } from "./controllers/UserController";
import { ProjectController } from "./controllers/ProjectController";
import { SprintController } from "./controllers/SprintController";
import { ProjectMemberController } from "./controllers/ProjectMemberController";
import { TaskController } from "./controllers/TaskController";
import { CommentController } from "./controllers/CommentController";
import { AuthController } from "./controllers/AuthController";

export const createRouter = (dataSource: DataSource) => {
  const router = Router();

  const userService = new UserService(dataSource.getRepository(User));
  const projectService = new ProjectService(
    dataSource.getRepository(Project),
    dataSource.getRepository(User),
    dataSource.getRepository(ProjectMember)
  );
  const sprintService = new SprintService(
    dataSource.getRepository(Sprint),
    dataSource.getRepository(Project),
    dataSource.getRepository(ProjectMember)
  );
  const memberService = new ProjectMemberService(
    dataSource.getRepository(ProjectMember),
    dataSource.getRepository(Project),
    dataSource.getRepository(User)
  );
  const taskService = new TaskService(
    dataSource.getRepository(Task),
    dataSource.getRepository(Project),
    dataSource.getRepository(Sprint),
    dataSource.getRepository(User),
    dataSource.getRepository(ProjectMember)
  );
  const commentService = new CommentService(
    dataSource.getRepository(Comment),
    dataSource.getRepository(Task),
    dataSource.getRepository(Project),
    dataSource.getRepository(Sprint),
    dataSource.getRepository(ProjectMember)
  );

  const authService = new AuthService(dataSource.getRepository(User));

  const userController = new UserController(userService);
  const projectController = new ProjectController(projectService);
  const sprintController = new SprintController(sprintService);
  const taskController = new TaskController(taskService);
  const commentController = new CommentController(commentService);
  const authController = new AuthController(authService);
  const memberController  = new ProjectMemberController(memberService);

  router.get("/", (_req, res) => {
    res.json({ ok: true, message: "Api Back funcionando" });
  });

  router.post("/users/register", userController.register);
  router.post("/auth/login", authController.login);
  
  router.post("/auth/logout", authController.logout);
  router.get("/me", userController.me);
  router.post("/users", userController.create);
  router.get("/users", userController.list);
  router.get("/users/:id", userController.getById);
  router.put("/users/:id", userController.update);
  router.delete("/users/:id", userController.remove);

  router.get("/projects", projectController.list);
  router.get("/projects/:id", projectController.getById);
  router.get("/projects/:id/members", projectController.listMembers);
  router.post("/projects", projectController.create);
  router.put("/projects/:id", projectController.update);
  router.delete("/projects/:id", projectController.remove);

  router.get("/sprints", sprintController.list);
  router.get("/sprints/:id", sprintController.getById);
  router.post("/sprints", sprintController.create);
  router.put("/sprints/:id", sprintController.update);
  router.delete("/sprints/:id", sprintController.remove);

  router.get("/members/me/projects", memberController.listMyProjects);
  router.get("/members/:projectId", memberController.listByProject);
  router.get("/members/:projectId/available", memberController.listAvailableUsers);
  router.post("/members/:projectId", memberController.add);
  router.put("/members/:projectId/:userId", memberController.update);
  router.delete("/members/:projectId/:userId", memberController.delete);

  router.get("/tasks", taskController.list);
  router.get("/tasks/:id", taskController.getById);
  router.post("/tasks", taskController.create);
  router.put("/tasks/:id", taskController.update);
  router.delete("/tasks/:id", taskController.remove);

  router.get("/comments", commentController.list);
  router.get("/comments/:id", commentController.getById);
  router.post("/comments", commentController.create);
  router.put("/comments/:id", commentController.update);
  router.delete("/comments/:id", commentController.remove);

  return router;
};
