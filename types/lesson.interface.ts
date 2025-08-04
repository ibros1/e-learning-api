export interface iCreatedLesson {
  userId: number;
  courseId: number;
  chapterId: string;
  title: string;
  content: string;
  isCompleted?: boolean;
  video_url: string;
}

export interface iUpdatedLesson {
  id: string;
  courseId: number;
  userId: number;
  title: string;
  content: string;
  chapterId: string;
  isCompleted?: boolean;
  video_url: string;
}
