"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";
import type { Role } from "@/types/auth.types";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Quando omitido, qualquer usuário autenticado tem acesso. */
  allowedRoles?: Role[];
}

// Guarda client-side, não Middleware: a sessão vive em localStorage, e o
// Middleware roda no Edge, onde não há acesso a ela.
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuth();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // StrictMode roda esse efeito 2x em dev; sem esperar esse ciclo, a 1a
    // passada pode disparar antes do localStorage assentar e chutar um
    // usuário autenticado pro login (reproduz dando F5 na rota protegida).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  const isAuthorized =
    hasMounted && isAuthenticated && (!allowedRoles || hasRole(...allowedRoles));

  useEffect(() => {
    if (!hasMounted) return;

    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (allowedRoles && !hasRole(...allowedRoles)) {
      router.replace("/");
    }
  }, [hasMounted, isAuthenticated, allowedRoles, hasRole, router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
