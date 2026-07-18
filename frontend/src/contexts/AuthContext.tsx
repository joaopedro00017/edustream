"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { loginRequest } from "@/lib/auth/auth-service";
import {
  clearSession,
  getServerSessionSnapshot,
  getSessionSnapshot,
  persistSession,
  subscribeToSession,
} from "@/lib/auth/token-storage";
import type { AuthenticatedUser, LoginCredentials, Role } from "@/types/auth.types";

export interface AuthContextValue {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthenticatedUser>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );
  const user = session?.user ?? null;

  const login = useCallback(async (credentials: LoginCredentials) => {
    const nextSession = await loginRequest(credentials);
    persistSession(nextSession);
    return nextSession.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    router.push("/auth/login");
  }, [router]);

  const hasRole = useCallback(
    (...roles: Role[]) => !!user && roles.some((role) => user.roles.includes(role)),
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      logout,
      hasRole,
    }),
    [user, login, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
