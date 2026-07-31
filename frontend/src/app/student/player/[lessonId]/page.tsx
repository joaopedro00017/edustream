"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { getLesson } from "@/lib/lessons/lesson-service";
import { markLessonAsWatched } from "@/lib/lessons/lesson-progress-service";
import { getCourse } from "@/lib/courses/course-service";
import { parseVideoUrl } from "@/lib/video";
import type { Lesson } from "@/types/lesson.types";
import type { ApiErrorResponse } from "@/types/api.types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function LessonPlayerPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseTitle, setCourseTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<
    string | null
  >(null);
  const [isMarking, setIsMarking] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function carregarDados() {
      try {
        const [aula, curso] = await Promise.all([
          getLesson(lessonId),
          courseId ? getCourse(courseId) : Promise.resolve(null),
        ]);
        if (!isMounted) return;

        setLesson(aula);
        setCourseTitle(curso?.title ?? null);
      } catch (error) {
        console.error("Erro ao buscar a aula", error);
        if (isMounted) setHasLoadError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    carregarDados();
    return () => {
      isMounted = false;
    };
  }, [lessonId, courseId]);

  async function handleMarkAsWatched() {
    setIsMarking(true);
    setAccessDeniedMessage(null);

    try {
      await markLessonAsWatched(lessonId);
      setIsWatched(true);
      toast.success("Aula marcada como assistida!");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as ApiErrorResponse | undefined)?.message
          : undefined;

      if (err instanceof AxiosError && err.response?.status === 403) {
        setAccessDeniedMessage(
          message ?? "Você precisa se matricular neste curso antes.",
        );
        return;
      }

      toast.error(message ?? "Não foi possível registrar o progresso.");
    } finally {
      setIsMarking(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-6 h-8 w-1/2" />
        <Skeleton className="mt-6 aspect-video w-full rounded-xl" />
      </div>
    );
  }

  if (hasLoadError || !lesson) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Não foi possível carregar esta aula</AlertTitle>
          <AlertDescription>
            Tente recarregar a página em instantes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const video = parseVideoUrl(lesson.videoUrl);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/student/courses" />}>
              Catálogo
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {courseId && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href={`/student/courses/${courseId}`} />}
                >
                  {courseTitle ?? "Curso"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>{lesson.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-4 text-2xl font-semibold text-foreground">
        {lesson.title}
      </h1>
      <p className="mt-2 text-muted-foreground">{lesson.description}</p>

      <div className="mt-6 aspect-video w-full overflow-hidden rounded-xl bg-black">
        {video.kind === "youtube" ? (
          <iframe
            src={video.embedUrl}
            title={lesson.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={video.embedUrl} controls className="h-full w-full" />
        )}
      </div>

      {accessDeniedMessage && (
        <Alert variant="destructive" className="mt-6">
          <CircleAlert />
          <AlertTitle>Acesso negado</AlertTitle>
          <AlertDescription>
            {accessDeniedMessage}{" "}
            <Button
              nativeButton={false}
              render={<Link href="/student/courses" />}
              variant="link"
              className="h-auto p-0"
            >
              Voltar ao catálogo
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-6">
        <Button
          onClick={handleMarkAsWatched}
          disabled={isMarking || isWatched}
        >
          {isWatched ? (
            <>
              <CheckCircle2 />
              Aula assistida
            </>
          ) : isMarking ? (
            "Registrando..."
          ) : (
            "Marcar como assistida"
          )}
        </Button>
      </div>
    </div>
  );
}
