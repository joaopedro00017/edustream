import { apiClient } from "@/lib/http/api-client";
import type { Enrollment, EnrolledStudent } from "@/types/enrollment.types";

export const enroll = (courseId: string) =>
  apiClient
    .post<Enrollment>(`/enrollments/${courseId}`)
    .then((response) => response.data);

export const listMyEnrollments = () =>
  apiClient
    .get<Enrollment[]>("/enrollments/my-courses")
    .then((response) => response.data);

export const listCourseEnrollments = (courseId: string) =>
  apiClient
    .get<EnrolledStudent[]>(`/enrollments/course/${courseId}`)
    .then((response) => response.data);
