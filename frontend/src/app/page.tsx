import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          EduStream
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Cursos em vídeo sob demanda, no seu ritmo.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/auth/login"
          className="rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Entrar
        </Link>
        <Link
          href="/auth/register"
          className="rounded-md border border-border px-5 py-2.5 font-medium text-foreground transition-colors hover:bg-surface-elevated"
        >
          Criar conta
        </Link>
      </div>
    </main>
  );
}
