export interface Course {
  id: string;
  title: string;
  description: string;
  instructorName: string;
}

export interface CourseRequest {
  title: string;
  description: string;
}
