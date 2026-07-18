import { apiClient } from "@/lib/http/api-client";
import type {
  AuthenticatedUser,
  AuthSession,
  LoginCredentials,
  RegisterPayload,
} from "@/types/auth.types";

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  const { data } = await apiClient.post<AuthSession>(
    "/auth/login",
    credentials,
  );
  return data;
}

export async function registerRequest(
  payload: RegisterPayload,
): Promise<AuthenticatedUser> {
  const { data } = await apiClient.post<AuthenticatedUser>(
    "/auth/register",
    payload,
  );
  return data;
}
