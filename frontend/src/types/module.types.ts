export interface CourseModule {
  id: string;
  title: string;
  description: string;
  courseId: string;
}

export interface ModuleRequest {
  title: string;
  description: string;
  courseId: string;
}
