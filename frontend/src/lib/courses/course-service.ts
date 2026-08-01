import { apiClient } from "@/lib/http/api-client";
import type { Course, CourseRequest } from "@/types/course.types";
import type { PagedResponse } from "@/types/api.types";

export const listCourses = (page = 0, size = 12) =>
  apiClient
    .get<PagedResponse<Course>>("/courses", { params: { page, size } })
    .then((response) => response.data);

export const listMyCourses = () =>
  apiClient
    .get<Course[]>("/courses/my-courses")
    .then((response) => response.data);

export const getCourse = (id: string) =>
  apiClient.get<Course>(`/courses/${id}`).then((response) => response.data);

export const createCourse = (dto: CourseRequest) =>
  apiClient.post<Course>("/courses", dto).then((response) => response.data);

export const updateCourse = (id: string, dto: CourseRequest) =>
  apiClient
    .put<Course>(`/courses/${id}`, dto)
    .then((response) => response.data);

export const deleteCourse = (id: string) => apiClient.delete(`/courses/${id}`);
