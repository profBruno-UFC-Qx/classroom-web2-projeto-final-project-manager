import { In, Not, Repository } from "typeorm";
import { ProjectMember, ProjectRole } from "../models/ProjectMember";
import { User } from "../models/User";
import { Project } from "../models/Project";
import {
  AuthUser,
  NotFoundError,
  ForbiddenError,
  assertAuthenticated,
  isAdmin,
} from "./utils";

export type CreateProjectMemberInput = {
  userId: number;
  role?: ProjectRole;
};

export type UpdateProjectMemberInput = {
  role: ProjectRole;
};

export class ProjectMemberService {
  constructor(
    private memberRepo: Repository<ProjectMember>,
    private projectRepo: Repository<Project>,
    private userRepo: Repository<User>
  ) {}

  async listByProject(projectId: number): Promise<ProjectMember[]> {
    return this.memberRepo.find({
      where: { projectId },
      relations: { user: true },
    });
  }

  async listProjectsByUser(currentUser?: AuthUser): Promise<Project[]> {
    assertAuthenticated(currentUser);

    const memberships = await this.memberRepo.find({
      where: { userId: currentUser.id },
      relations: { project: true },
    });

    return memberships.map(membership => membership.project);
  }


  async listAvailableUsers(projectId: number, currentUser?: AuthUser): Promise<User[]> {
    assertAuthenticated(currentUser);
    await this.assertCanManageMembers(projectId, currentUser);

    const memberships = await this.memberRepo.find({
      select: { userId: true },
      where: { projectId },
    });
    const memberIds = memberships.map((membership) => membership.userId);

    if (!memberIds.length) {
      return this.userRepo.find();
    }

    return this.userRepo.find({
      where: { id: Not(In(memberIds)) },
    });
  }

  async add(projectId: number, input: CreateProjectMemberInput, currentUser?: AuthUser) {
    assertAuthenticated(currentUser);
    await this.assertCanManageMembers(projectId, currentUser);

    const user = await this.userRepo.findOneBy({ id: input.userId });
    if (!user) throw new NotFoundError("User not found");

    const membership = this.memberRepo.create({
      projectId,
      userId: input.userId,
      role: input.role ?? ProjectRole.Member,
    });

    return this.memberRepo.save(membership);
  }

  async update(projectId: number, userId: number, input: UpdateProjectMemberInput, currentUser?: AuthUser) {
    assertAuthenticated(currentUser);
    await this.assertCanManageMembers(projectId, currentUser);

    const membership = await this.memberRepo.findOneBy({ projectId, userId });
    if (!membership) throw new NotFoundError("Membership not found");

    membership.role = input.role;
    return this.memberRepo.save(membership);
  }

  async delete(projectId: number, userId: number, currentUser?: AuthUser) {
    assertAuthenticated(currentUser);
    await this.assertCanManageMembers(projectId, currentUser);

    const membership = await this.memberRepo.findOneBy({ projectId, userId });
    if (!membership) throw new NotFoundError("Membership not found");

    await this.memberRepo.delete({ projectId, userId });
  }

  private async assertCanManageMembers(
    projectId: number,
    currentUser: AuthUser
  ) {
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) throw new NotFoundError("Project not found");

    if (isAdmin(currentUser) || project.ownerId === currentUser.id) {
      return;
    }

    const membership = await this.memberRepo.findOneBy({
      projectId,
      userId: currentUser.id,
    });

    if (membership?.role !== ProjectRole.Admin) {
      throw new ForbiddenError("Only project admin can manage members");
    }
  }
}
