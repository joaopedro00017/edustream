import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CircleCheckBig,
  GraduationCap,
  Play,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NAV_LINKS = [
  { href: "#alunos", label: "Para alunos" },
  { href: "#instrutores", label: "Para instrutores" },
];

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BookOpen,
    title: "Aprenda no seu ritmo",
    description:
      "Assista às aulas quando quiser e retome de onde parou, sem prazos rígidos.",
  },
  {
    icon: GraduationCap,
    title: "Instrutores especialistas",
    description:
      "Cursos criados por profissionais que atuam na prática do que ensinam.",
  },
  {
    icon: Award,
    title: "Certificado ao concluir",
    description:
      "Receba um certificado com validação pública ao finalizar cada curso.",
  },
];

const STUDENT_BENEFITS = [
  "Catálogo com cursos de instrutores especialistas",
  "Acompanhe seu progresso aula a aula",
  "Ganhe certificado ao concluir um curso",
];

const INSTRUCTOR_BENEFITS = [
  "Publique cursos e organize em módulos",
  "Acompanhe métricas de alunos matriculados",
  "Gerencie tudo em um painel único",
];

const AVATAR_BG_CLASSES = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
];

function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-300 px-6 sm:px-10", className)}>
      {children}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: (typeof FEATURES)[number]) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex size-11 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
          <Icon className="size-5.5" />
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

function BenefitItem({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-foreground/90">
      <CircleCheckBig className="mt-0.5 size-4.5 shrink-0 text-primary" />
      <span>{children}</span>
    </li>
  );
}

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-9">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/icons/graduation-cap.svg"
                alt=""
                className="size-5.5"
              />
              <span className="text-lg font-semibold tracking-tight text-foreground">
                EduStream
              </span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-foreground"
            >
              Entrar
            </Link>
            <Button
              nativeButton={false}
              render={<Link href="/auth/register" />}
            >
              Criar conta
            </Button>
          </div>
        </Container>
      </header>

      <main>
        <section>
          <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-28">
            <div>
              <Badge className="h-auto rounded-full bg-primary/10 px-3.5 py-1.5 text-[13px] font-medium text-primary">
                Plataforma de vídeo-aulas
              </Badge>
              <h1 className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Cursos em vídeo, sob demanda — no seu ritmo.
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
                A EduStream reúne instrutores especialistas e aulas em vídeo
                para você aprender quando, onde e como quiser.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Button
                  nativeButton={false}
                  render={<Link href="/auth/register" />}
                  size="lg"
                >
                  Criar conta grátis
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  nativeButton={false}
                  render={<Link href="/auth/login" />}
                  variant="outline"
                  size="lg"
                >
                  Já tenho conta
                </Button>
              </div>
              <div className="mt-9 flex items-center gap-3.5">
                <div className="flex">
                  {AVATAR_BG_CLASSES.map((bgClass, index) => (
                    <div
                      key={bgClass}
                      className={cn(
                        "size-8 rounded-full border-2 border-background",
                        bgClass,
                        index > 0 && "-ml-2",
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Alunos e instrutores já estão aprendendo e ensinando na
                  EduStream
                </span>
              </div>
            </div>

            <div className="rounded-[18px] border border-border bg-surface p-4 shadow-2xl shadow-black/40">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[10px] bg-linear-to-br from-primary/25 via-surface-elevated to-surface-elevated">
                <div className="flex size-13 items-center justify-center rounded-full bg-primary/90">
                  <Play className="size-5 fill-white text-white" />
                </div>
              </div>
              <div className="mt-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Aula em andamento
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Continue de onde parou
                  </p>
                </div>
                <div className="size-8.5 shrink-0 rounded-full bg-primary" />
              </div>
            </div>
          </Container>
        </section>

        <section>
          <Container className="pb-20 sm:pb-24">
            <h2 className="text-center text-2xl font-bold text-foreground sm:text-[28px]">
              Por que aprender na EduStream
            </h2>
            <p className="mt-2.5 text-center text-muted-foreground">
              Tudo o que você precisa para evoluir, em um só lugar.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </Container>
        </section>

        <section>
          <Container className="grid gap-6 pb-20 sm:pb-24 md:grid-cols-2">
            <Card id="alunos" className="scroll-mt-24 p-9">
              <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                Para alunos
              </span>
              <h3 className="mt-3 text-2xl font-bold text-foreground">
                Aprenda no seu ritmo
              </h3>
              <ul className="mt-5 flex flex-col gap-3.5">
                {STUDENT_BENEFITS.map((benefit) => (
                  <BenefitItem key={benefit}>{benefit}</BenefitItem>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Explorar catálogo
                <ArrowRight className="size-3.5" />
              </Link>
            </Card>

            <Card id="instrutores" className="scroll-mt-24 p-9">
              <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                Para instrutores
              </span>
              <h3 className="mt-3 text-2xl font-bold text-foreground">
                Ensine para quem quer aprender
              </h3>
              <ul className="mt-5 flex flex-col gap-3.5">
                {INSTRUCTOR_BENEFITS.map((benefit) => (
                  <BenefitItem key={benefit}>{benefit}</BenefitItem>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Comece a ensinar
                <ArrowRight className="size-3.5" />
              </Link>
            </Card>
          </Container>
        </section>

        <section className="border-y border-border bg-surface">
          <Container className="py-16 text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Pronto para começar a aprender?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Crie sua conta gratuitamente e explore o catálogo agora.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/auth/register" />}
              size="lg"
              className="mt-7"
            >
              Criar conta grátis
            </Button>
          </Container>
        </section>
      </main>

      <footer>
        <Container className="py-8 text-center sm:text-left">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EduStream
          </span>
        </Container>
      </footer>
    </>
  );
}
