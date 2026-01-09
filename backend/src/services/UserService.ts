import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import {
  AuthUser,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  assertAdmin,
  assertAuthenticated,
  isAdmin,
} from "./utils";

export type CreateUserInput = {
  name: string;
  email: string;
  password?: string;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
};

export class UserService {
  constructor(private userRepo: Repository<User>) {}

  async register(input: CreateUserInput): Promise<User> {
    if (!input.password) {
      throw new BadRequestError("Password is required");
    }

    const user = this.userRepo.create({
      name: input.name,
      email: input.email,
      passwordHash: await bcrypt.hash(input.password, 10),
    });

    const saved = await this.userRepo.save(user);
    delete (saved as User & { passwordHash?: string }).passwordHash;
    return saved;
  }

  async createUser(input: CreateUserInput, currentUser?: AuthUser): Promise<User> {
    assertAuthenticated(currentUser);
    assertAdmin(currentUser);

    if (!input.password) {
      throw new BadRequestError("Password is required");
    }

    const user = this.userRepo.create({
      name: input.name,
      email: input.email,
      passwordHash: await bcrypt.hash(input.password, 10),
    });

    const saved = await this.userRepo.save(user);
    delete (saved as User & { passwordHash?: string }).passwordHash;
    return saved;
  }

  async listAll(currentUser?: AuthUser): Promise<User[]> {
    assertAuthenticated(currentUser);
    assertAdmin(currentUser);

    return this.userRepo.find();
  }

  async getById(id: number, currentUser?: AuthUser): Promise<User> {
    assertAuthenticated(currentUser);

    if (!isAdmin(currentUser) && currentUser.id !== id) {
      throw new ForbiddenError("You can only view your own user");
    }

    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async updateUser(
    id: number,
    input: UpdateUserInput,
    currentUser?: AuthUser
  ): Promise<User> {
    assertAuthenticated(currentUser);

    if (!isAdmin(currentUser) && currentUser.id !== id) {
      throw new ForbiddenError("You can only update your own user");
    }

    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    Object.assign(user, input);
    return this.userRepo.save(user);
  }

  async deleteUser(id: number, currentUser?: AuthUser): Promise<void> {
    assertAuthenticated(currentUser);
    assertAdmin(currentUser);

    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await this.userRepo.remove(user);
  }
}
