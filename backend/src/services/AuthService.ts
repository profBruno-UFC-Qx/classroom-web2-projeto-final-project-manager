import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { BadRequestError, UnauthorizedError } from "./utils";

export type LoginInput = {
  email?: string;
  password?: string;
};

export type LoginResult = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export class AuthService {
  constructor(private userRepo: Repository<User>) {}

  async login(input: LoginInput): Promise<LoginResult> {
    const email = input.email?.trim().toLowerCase();
    const password = input.password?.trim();

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const user = await this.userRepo
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("user.email = :email", { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign(
      { sub: String(user.id) },
      process.env.JWT_SECRET ?? "dev-secret",
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
