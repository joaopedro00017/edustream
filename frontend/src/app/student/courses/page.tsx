"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";
import { listCourses } from "@/lib/courses/course-service";
import {
  listMyEnrollments,
  enroll,
} from "@/lib/enrollments/enrollment-service";
import type { Course } from "@/types/course.types";
import type { ApiErrorResponse } from "@/types/api.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

export default function StudentCoursesPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function carregarDados() {
      try {
        const [cursosPaginados, minhasMatriculas] = await Promise.all([
          listCourses(page),
          listMyEnrollments(),
        ]);
        if (!isMounted) return;

        setCourses(cursosPaginados.content);
        setTotalPages(cursosPaginados.totalPages);
        setIsFirstPage(cursosPaginados.first);
        setIsLastPage(cursosPaginados.last);
        setEnrolledCourseIds(
          new Set(minhasMatriculas.map((matricula) => matricula.courseId)),
        );
      } catch (error) {
        console.error("Erro ao buscar o catálogo de cursos", error);
        if (isMounted) setHasLoadError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    carregarDados();
    return () => {
      isMounted = false;
    };
  }, [page]);

  async function handleEnroll(course: Course) {
    setSubmittingId(course.id);

    try {
      await enroll(course.id);
      setEnrolledCourseIds((previous) => new Set(previous).add(course.id));
      toast.success(`Matrícula em "${course.title}" confirmada!`);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as ApiErrorResponse | undefined)?.message
          : undefined;
      toast.error(message ?? "Não foi possível concluir a matrícula.");
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Catálogo de cursos
        </h1>
        <p className="text-muted-foreground">
          Aqui você encontrará cursos disponíveis de acordo com os melhores
          instrutores do site.
        </p>
      </div>

      {hasLoadError && (
        <Alert variant="destructive" className="mt-6">
          <CircleAlert />
          <AlertTitle>Não foi possível carregar o catálogo</AlertTitle>
          <AlertDescription>
            Tente recarregar a página em instantes.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        !hasLoadError && (
          <p className="mt-8 text-muted-foreground">
            Nenhum curso disponível no momento.
          </p>
        )
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseIds.has(course.id);
            const isSubmitting = submittingId === course.id;

            return (
              <Card key={course.id} className="justify-between">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.instructorName}</CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </CardContent>

                <CardFooter>
                  {isEnrolled ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        router.push(`/student/courses/${course.id}`)
                      }
                    >
                      Acessar Curso
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={isSubmitting}
                      onClick={() => handleEnroll(course)}
                    >
                      {isSubmitting ? "Matriculando..." : "Matricular-se"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={isFirstPage}
                className={
                  isFirstPage ? "pointer-events-none opacity-50" : undefined
                }
                onClick={(event) => {
                  event.preventDefault();
                  if (!isFirstPage) {
                    setIsLoading(true);
                    setPage((previous) => previous - 1);
                  }
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 text-sm text-muted-foreground">
                Página {page + 1} de {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={isLastPage}
                className={
                  isLastPage ? "pointer-events-none opacity-50" : undefined
                }
                onClick={(event) => {
                  event.preventDefault();
                  if (!isLastPage) {
                    setIsLoading(true);
                    setPage((previous) => previous + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
