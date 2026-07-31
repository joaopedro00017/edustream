"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CircleAlert, PlayCircle } from "lucide-react";
import { getCourse } from "@/lib/courses/course-service";
import { listModulesByCourse } from "@/lib/modules/module-service";
import { listLessonsByModule } from "@/lib/lessons/lesson-service";
import { listMyEnrollments } from "@/lib/enrollments/enrollment-service";
import type { Course } from "@/types/course.types";
import type { Lesson } from "@/types/lesson.types";
import type { Enrollment } from "@/types/enrollment.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface ModuleWithLessons {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export default function CourseCurriculumPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function carregarDados() {
      try {
        const [curso, modulosDoCurso, minhasMatriculas] = await Promise.all([
          getCourse(courseId),
          listModulesByCourse(courseId),
          listMyEnrollments(),
        ]);

        const aulasPorModulo = await Promise.all(
          modulosDoCurso.map((modulo) => listLessonsByModule(modulo.id)),
        );

        if (!isMounted) return;

        setCourse(curso);
        setModules(
          modulosDoCurso.map((modulo, index) => ({
            ...modulo,
            lessons: aulasPorModulo[index],
          })),
        );
        setEnrollment(
          minhasMatriculas.find((m) => m.courseId === courseId) ?? null,
        );
      } catch (error) {
        console.error("Erro ao buscar currículo do curso", error);
        if (isMounted) setHasLoadError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    carregarDados();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-6 h-8 w-1/2" />
        <Skeleton className="mt-3 h-4 w-full" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (hasLoadError || !course) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Não foi possível carregar este curso</AlertTitle>
          <AlertDescription>
            Tente recarregar a página em instantes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isEnrolled = enrollment !== null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/student/courses" />}>
              Catálogo
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{course.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          {course.title}
        </h1>
        <p className="text-muted-foreground">{course.instructorName}</p>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{course.description}</p>

      {isEnrolled ? (
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Seu progresso</span>
            <span className="font-medium text-foreground">
              {Math.round(enrollment.progress)}%
            </span>
          </div>
          <Progress value={enrollment.progress} />
        </div>
      ) : (
        <Alert className="mt-6">
          <CircleAlert />
          <AlertTitle>Você ainda não está matriculado neste curso</AlertTitle>
          <AlertDescription>
            <Button
              nativeButton={false}
              render={<Link href="/student/courses" />}
              variant="link"
              className="h-auto p-0"
            >
              Volte ao catálogo para se matricular
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-8">
        {modules.length === 0 ? (
          <p className="text-muted-foreground">
            Este curso ainda não tem conteúdo publicado.
          </p>
        ) : (
          <Accordion multiple defaultValue={modules.map((m) => m.id)}>
            {modules.map((modulo) => (
              <AccordionItem key={modulo.id} value={modulo.id}>
                <AccordionTrigger>{modulo.title}</AccordionTrigger>
                <AccordionContent>
                  {modulo.lessons.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma aula publicada neste módulo ainda.
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {modulo.lessons.map((aula) => (
                        <li key={aula.id}>
                          {isEnrolled ? (
                            <Button
                              nativeButton={false}
                              render={
                                <Link
                                  href={`/student/player/${aula.id}?courseId=${courseId}`}
                                />
                              }
                              variant="ghost"
                              className="w-full justify-start gap-2"
                            >
                              <PlayCircle />
                              {aula.title}
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 px-2.5 py-1.5 text-sm text-muted-foreground">
                              <PlayCircle className="size-4" />
                              {aula.title}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
