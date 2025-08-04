import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: number;
  courseId?: number;
  lessonId?: string;
}
