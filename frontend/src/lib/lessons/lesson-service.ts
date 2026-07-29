import { apiClient } from "@/lib/http/api-client";
import type { Lesson, LessonRequest } from "@/types/lesson.types";

// Listagem por módulo
export const listLessonsByModule = (moduleId: string) =>
  apiClient
    .get<Lesson[]>(`/lessons/module/${moduleId}`)
    .then((response) => response.data);

// Busca de uma aula específica
export const getLesson = (id: string) =>
  apiClient.get<Lesson>(`/lessons/${id}`).then((response) => response.data);

// Funções de Gerenciamento do Instrutor
export const createLesson = (dto: LessonRequest) =>
  apiClient.post<Lesson>("/lessons", dto).then((response) => response.data);

export const updateLesson = (id: string, dto: LessonRequest) =>
  apiClient.put<Lesson>(`/lessons/${id}`, dto).then((response) => response.data);

export const deleteLesson = (id: string) => apiClient.delete(`/lessons/${id}`);
