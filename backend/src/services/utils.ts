import { UserRole } from "../models/User";

export type AuthUser = {
  id: number;
  role?: UserRole;
};

export class ForbiddenError extends Error {
  status = 403;

  constructor(message = "Access denied") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends Error {
  status = 401;

  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class BadRequestError extends Error {
  status = 400;

  constructor(message = "Bad request") {
    super(message);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends Error {
  status = 404;

  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export const isAdmin = (user: AuthUser) => user.role === UserRole.Admin;

export function assertAuthenticated(
  user?: AuthUser | null
): asserts user is AuthUser {
  if (!user) {
    throw new ForbiddenError("Authentication required");
  }
}

export const assertAdmin = (user: AuthUser) => {
  if (!isAdmin(user)) {
    throw new ForbiddenError("Admin access required");
  }
};
