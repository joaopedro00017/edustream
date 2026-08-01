import { apiClient } from "@/lib/http/api-client";
import type { CourseModule, ModuleRequest } from "@/types/module.types";

export const listModulesByCourse = (courseId: string) =>
  apiClient
    .get<CourseModule[]>(`/modules/course/${courseId}`)
    .then((response) => response.data);

export const createModule = (dto: ModuleRequest) =>
  apiClient.post<CourseModule>("/modules", dto).then((response) => response.data);

export const updateModule = (id: string, dto: ModuleRequest) =>
  apiClient
    .put<CourseModule>(`/modules/${id}`, dto)
    .then((response) => response.data);

export const deleteModule = (id: string) => apiClient.delete(`/modules/${id}`);
