import { apiClient } from "@/lib/http/api-client";
import type { Course, CourseRequest } from "@/types/course.types";

// Rota pública para os alunos
export const listCourses = () =>
  apiClient.get<Course[]>("/courses").then((response) => response.data);

// Rota Exclusiva para Instrutores
export const listMyCourses = () =>
  apiClient
    .get<Course[]>("/courses/my-courses")
    .then((response) => response.data);

export const getCourse = (id: string) =>
  apiClient.get<Course>(`/courses/${id}`).then((response) => response.data);

// Funções de Gerenciamento do Instrutor
export const createCourse = (dto: CourseRequest) =>
  apiClient.post<Course>("/courses", dto).then((response) => response.data);

export const updateCourse = (id: string, dto: CourseRequest) =>
  apiClient
    .put<Course>(`/courses/${id}`, dto)
    .then((response) => response.data);

export const deleteCourse = (id: string) => apiClient.delete(`/courses/${id}`);
