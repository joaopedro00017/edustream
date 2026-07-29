import { apiClient } from "@/lib/http/api-client";
import type { Lesson } from "@/types/lesson.types";

// Rota Exclusiva para Alunos
export const markLessonAsWatched = (lessonId: string) =>
  apiClient
    .post<Lesson>(`/lessons-progress/${lessonId}/watch`)
    .then((response) => response.data);
