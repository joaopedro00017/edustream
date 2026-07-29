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

/**
 * Guarda client-side. Não usamos o Middleware do Next.js aqui porque a sessão
 * vive em localStorage (o backend é stateless e não emite cookies), algo que
 * o Middleware — executado no Edge — não consegue ler.
 *
 * O `hasMounted` é proposital, mesmo o AuthContext já usando
 * useSyncExternalStore para evitar mismatch de hidratação: em desenvolvimento
 * o React StrictMode invoca o efeito de redirect duas vezes de propósito
 * (monta → desmonta → monta), e a primeira invocação pode rodar antes do
 * snapshot real do localStorage se assentar, disparando um redirect pro
 * login mesmo com sessão válida (reproduzido dando F5 numa rota protegida).
 * Esperar um ciclo de efeito extra garante que a decisão de redirecionar só
 * roda depois que tudo já estabilizou.
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuth();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ver comentário do componente
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
