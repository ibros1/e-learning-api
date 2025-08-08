import { EnrollmentStatus } from "@prisma/client";

export interface icreatedEnrollment {
  userId: number;
  courseId: number;
  progress: number;
  status: EnrollmentStatus;
  paymentId: string;
  isEnrolled: boolean;
}

// update
export interface iUpdatedEnrollment {
  id: string;
  userId: number;
  courseId: number;

  status: EnrollmentStatus;
  isEnrolled: boolean;
}
