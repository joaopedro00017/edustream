"use client";

import { useState, type FormEvent } from "react";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerRequest } from "@/lib/auth/auth-service";
import { ROLES, type Role } from "@/types/auth.types";
import type { ApiErrorResponse } from "@/types/api.types";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(ROLES.STUDENT);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await registerRequest({ name, email, password, role });
      router.push("/auth/login?registered=1");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as ApiErrorResponse | undefined)?.message
          : undefined;
      setError(message ?? "Não foi possível concluir o cadastro.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-surface p-8">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Criar conta</h1>
          <p className="text-sm text-muted">Comece a assistir aos seus cursos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm text-muted">
              Nome
            </label>
            <input
              id="name"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-foreground outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-muted">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-foreground outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-muted">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-foreground outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="role" className="text-sm text-muted">
              Eu sou
            </label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              className="w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-foreground outline-none focus:border-accent"
            >
              <option value={ROLES.STUDENT}>Aluno</option>
              <option value={ROLES.INSTRUCTOR}>Instrutor</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-accent px-3 py-2 font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Já tem conta?{" "}
          <Link href="/auth/login" className="text-accent hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
