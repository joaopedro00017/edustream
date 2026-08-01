"use client";

import { useState, type FormEvent } from "react";
import { AxiosError } from "axios";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerRequest } from "@/lib/auth/auth-service";
import { ROLES, type Role } from "@/types/auth.types";
import type { ApiErrorResponse } from "@/types/api.types";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";

const fieldClass =
  "w-full rounded-lg border border-border bg-surface-elevated py-2.5 pl-3.5 pr-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

const BENEFITS = [
  "Catálogo com cursos de instrutores especialistas",
  "Certificado com validação pública ao concluir",
];

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: ROLES.STUDENT, label: "Aluno" },
  { value: ROLES.INSTRUCTOR, label: "Instrutor" },
];

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
            Comece a aprender hoje.
          </h2>
          <p className="mb-6 max-w-80 text-sm leading-relaxed text-muted-foreground">
            Crie sua conta gratuita e tenha acesso ao catálogo completo de
            cursos.
          </p>
          <ul className="flex max-w-80 flex-col gap-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5">
                <CircleCheckBig className="mt-0.5 size-4.5 shrink-0 text-primary" />
                <span className="text-sm text-foreground/90">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <span className="z-10 text-sm text-muted-foreground">
          © {new Date().getFullYear()} EduStream
        </span>
      </div>

      <div className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-120 gap-0 p-10">
          <div className="mb-7">
            <h1 className="mb-1.5 text-3xl font-bold text-foreground">
              Criar conta
            </h1>
            <p className="text-sm text-muted-foreground">
              Comece a assistir aos seus cursos
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="name"
                className="text-[13px] font-normal text-muted-foreground"
              >
                Nome
              </Label>
              <input
                id="name"
                placeholder="Seu nome completo"
                required
                maxLength={100}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={fieldClass}
              />
            </div>

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
                maxLength={255}
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
                minLength={6}
                maxLength={100}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] text-muted-foreground">Eu sou</span>
              <div
                className="grid grid-cols-2 gap-2.5"
                role="radiogroup"
                aria-label="Eu sou"
              >
                {ROLE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={role === option.value}
                    onClick={() => setRole(option.value)}
                    className={cn(
                      "rounded-lg border px-3 py-3 text-center text-sm transition-colors",
                      role === option.value
                        ? "border-[1.5px] border-primary bg-primary/10 font-semibold text-foreground"
                        : "border-border font-medium text-muted-foreground hover:border-foreground/25",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="mt-1.5 w-full"
            >
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Entrar
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
