"use client";

import { useState, type FormEvent } from "react";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/types/auth.types";
import type { ApiErrorResponse } from "@/types/api.types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";

const fieldClass =
  "w-full rounded-lg border border-border bg-surface-elevated py-2.5 pl-3.5 pr-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });
      const destination = user.roles.includes(ROLES.INSTRUCTOR)
        ? "/instructor/dashboard"
        : "/student/courses";
      router.push(destination);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as ApiErrorResponse | undefined)?.message
          : undefined;
      setError(
        message ?? "Não foi possível entrar. Verifique suas credenciais.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[0.6fr_1.4fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border p-12 lg:flex">
        <div className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-primary/10 blur-3xl" />

        <Link href="/" className="z-10 flex w-fit items-center gap-2">
          <img src="/icons/graduation-cap.svg" alt="" className="size-5.5" />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            EduStream
          </span>
        </Link>

        <div className="z-10">
          <h2 className="mb-2.5 text-2xl font-semibold tracking-tight text-foreground">
            Continue de onde parou.
          </h2>
          <p className="max-w-80 text-sm leading-relaxed text-muted-foreground">
            Suas aulas e certificados estão te esperando.
          </p>
        </div>

        <span className="z-10 text-sm text-muted-foreground">
          © {new Date().getFullYear()} EduStream
        </span>
      </div>

      <div className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-95 gap-0 p-10">
          <div className="mb-8">
            <h1 className="mb-1.5 text-3xl font-bold text-foreground">
              Entrar
            </h1>
            <p className="text-sm text-muted-foreground">
              Acesse sua conta EduStream
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="text-[13px] font-normal text-muted-foreground"
              >
                E-mail
              </Label>
              <input
                id="email"
                type="email"
                placeholder="voce@email.com"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="password"
                className="text-[13px] font-normal text-muted-foreground"
              >
                Senha
              </Label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={fieldClass}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="mt-1.5 w-full"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
