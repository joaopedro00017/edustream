export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  moduleId: string;
}

export interface LessonRequest {
  title: string;
  description: string;
  videoUrl: string;
  moduleId: string;
}
