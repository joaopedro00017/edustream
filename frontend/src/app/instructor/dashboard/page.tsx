"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/http/api-client";
import { useAuth } from "@/hooks/useAuth";
import type { InstructorMetrics } from "@/types/instructor.types";

/**
 * Exemplo funcional ponta a ponta (auth + apiClient). Para dados reais,
 * troque este useEffect por uma lib de data-fetching com cache/retry
 * (TanStack Query ou SWR) — mantido simples aqui por ser só o esqueleto.
 */
export default function InstructorDashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<InstructorMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    apiClient
      .get<InstructorMetrics>("/instructor/metrics")
      .then(({ data }) => {
        if (isMounted) setMetrics(data);
      })
      .catch(() => {
        if (isMounted) setError("Não foi possível carregar as métricas.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">
        Olá, {user?.name}
      </h1>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Alunos" value={metrics?.totalAlunos} />
        <MetricCard
          label="Taxa de conclusão média"
          value={
            metrics ? `${(metrics.taxaDeConclusaoMedia * 100).toFixed(0)}%` : undefined
          }
        />
        <MetricCard label="Cursos publicados" value={metrics?.cursosPublicados} />
      </dl>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-3xl font-semibold text-foreground">{value ?? "—"}</dd>
    </div>
  );
}
