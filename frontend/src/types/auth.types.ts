/**
 * Espelha exatamente com.edustream.api.domain.model.RoleName no backend.
 * Qualquer papel novo precisa ser adicionado nos dois lados.
 */
export type Role = "ROLE_STUDENT" | "ROLE_INSTRUCTOR" | "ROLE_ADMIN";

export const ROLES = {
  STUDENT: "ROLE_STUDENT",
  INSTRUCTOR: "ROLE_INSTRUCTOR",
  ADMIN: "ROLE_ADMIN",
} as const satisfies Record<string, Role>;

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

/** Payload persistido no client após login (ver nota sobre POST /auth/login no lib/auth/auth-service.ts). */
export interface AuthSession {
  token: string;
  user: AuthenticatedUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}
