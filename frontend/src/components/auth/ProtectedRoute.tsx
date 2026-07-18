"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";
import type { Role } from "@/types/auth.types";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Quando omitido, qualquer usuário autenticado tem acesso. */
  allowedRoles?: Role[];
}

/**
 * Guarda client-side. Não usamos o Middleware do Next.js aqui porque a sessão
 * vive em localStorage (o backend é stateless e não emite cookies), algo que
 * o Middleware — executado no Edge — não consegue ler.
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  const isAuthorized =
    isAuthenticated && (!allowedRoles || hasRole(...allowedRoles));

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (allowedRoles && !hasRole(...allowedRoles)) {
      router.replace("/");
    }
  }, [isAuthenticated, allowedRoles, hasRole, router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
