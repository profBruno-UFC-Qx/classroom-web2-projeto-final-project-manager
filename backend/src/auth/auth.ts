import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../models/User";
import { AuthUser, UnauthorizedError } from "../services/utils";

export const getAuthUser = (req: Request): AuthUser | undefined => {
  const authorization = req.header("Authorization");
  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
      return undefined;
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? "dev-secret") as JwtPayload & {
        role?: UserRole;
      };
      const subject = payload.sub;
      const id = Number(subject);
      if (!Number.isFinite(id)) {
        throw new UnauthorizedError("Invalid token subject");
      }

      const role = payload.role;
      if (role && !Object.values(UserRole).includes(role)) {
        throw new UnauthorizedError("Invalid token role");
      }

      return role ? { id, role } : { id };
    } catch {
      throw new UnauthorizedError("Invalid token");
    }
  }

  const idHeader = req.header("x-user-id");

  if (!idHeader) {
    return undefined;
  }

  const id = Number(idHeader);
  if (!Number.isFinite(id)) {
    return undefined;
  }

  const roleHeader = req.header("x-user-role");
  if (!roleHeader) {
    return { id };
  }

  const role = roleHeader.toLowerCase() as UserRole;
  if (!Object.values(UserRole).includes(role)) {
    return { id };
  }

  return { id, role };
};
