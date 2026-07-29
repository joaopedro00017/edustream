import { apiClient } from "@/lib/http/api-client";
import type { Enrollment } from "@/types/enrollment.types";

// Rota Exclusiva para Alunos
export const enroll = (courseId: string) =>
  apiClient
    .post<Enrollment>(`/enrollments/${courseId}`)
    .then((response) => response.data);

export const listMyEnrollments = () =>
  apiClient
    .get<Enrollment[]>("/enrollments/my-courses")
    .then((response) => response.data);
