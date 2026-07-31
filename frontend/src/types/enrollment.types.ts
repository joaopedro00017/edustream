export interface Enrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  enrollmentDate: string;
  progress: number;
}

export interface EnrolledStudent {
  studentId: string;
  studentName: string;
  studentEmail: string;
  progress: number;
}
