export interface iCreatedChapter {
  userId: number;
  courseId: number;
  chapterTitle: string;
}

export interface iUpdatedChapter {
  chapterId: string;
  courseId: number;
  chapterTitle: string;
}
