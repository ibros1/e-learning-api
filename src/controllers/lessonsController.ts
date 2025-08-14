import { PrismaClient } from "@prisma/client";

import { Request, Response } from "express";
import { iCreatedLesson, iUpdatedLesson } from "../../types/lesson.interface";
import { AuthRequest } from "../../types/request";

const prisma = new PrismaClient();

export const createLessons = async (req: Request, res: Response) => {
  try {
    const data: iCreatedLesson = req.body;
    if (
      !data.title ||
      !data.userId ||
      !data.courseId ||
      !data.content ||
      !data.video_url ||
      !data.chapterId
    ) {
      res.status(400).json({
        isSuccess: false,
        message: "validating lesson error!",
      });
      return;
    }
    // check user creating the lesson
    const user = await prisma.user.findFirst({
      where: {
        id: data.userId,
      },
    });
    if (!user) {
      res.status(400).json({
        isSuccess: false,
        message: "User not found",
      });
      return;
    }

    const course = await prisma.course.findUnique({
      where: {
        id: data.courseId,
      },
    });

    if (!course) {
      res.status(404).json({
        isSuccess: false,
        message: "Course not found",
      });
      return;
    }
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: data.chapterId,
      },
    });

    if (!chapter) {
      res.status(404).json({
        isSuccess: false,
        message: "Chapter not found",
      });
      return;
    }

    const createdLesson = await prisma.lessons.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        chapterId: data.chapterId,
        title: data.title,
        content: data.content,
        video_url: data.video_url,
        is_completed: Boolean(data.isCompleted),
      },

      include: {
        chapters: {
          select: {
            id: true,
            chapterTitle: true,
          },
        },
        users: {
          select: {
            full_name: true,
            profilePhoto: true,
          },
        },
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "successfully created lesson!",
      createdLesson,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const updateLessons = async (req: AuthRequest, res: Response) => {
  try {
    const data: iUpdatedLesson = req.body;

    if (
      !data.id ||
      !data.courseId ||
      !data.chapterId ||
      !data.userId ||
      !data.title ||
      !data.content
    ) {
      res.status(400).json({
        isSuccess: false,
        message: "Validation error: missing required fields",
      });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        id: data.userId,
      },
    });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "user not found!",
      });
      return;
    }

    const chapterId = await prisma.chapter.findFirst({
      where: {
        id: data.chapterId,
      },
    });
    if (!chapterId) {
      res.status(404).json({
        isSuccess: false,
        message: "course not found",
      });
      return;
    }
    const course = await prisma.course.findFirst({
      where: {
        id: data.courseId,
      },
    });
    if (!course) {
      res.status(404).json({
        isSuccess: false,
        message: "course not found",
      });
      return;
    }
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: data.chapterId,
      },
      include: {
        courses: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!chapter) {
      res.status(404).json({
        isSuccess: false,
        message: "Chapter not found",
      });
      return;
    }

    const lesson = await prisma.lessons.update({
      where: {
        id: data.id,
      },
      data: {
        courseId: data.courseId,
        chapterId: data.chapterId,
        title: data.title,
        content: data.content,
        is_completed: data.isCompleted,
        video_url: data.video_url,
      },
      include: {
        chapters: {
          select: {
            id: true,
            chapterTitle: true,
          },
        },
        courses: true,
        users: {
          select: {
            id: true,
            full_name: true,
            profilePhoto: true,
          },
        },
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "successfully updated the lesson",
      lesson,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const getAllLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await prisma.lessons.findMany({
      include: {
        chapters: {
          select: {
            id: true,
            chapterTitle: true,
          },
        },

        users: {
          select: {
            id: true,
            full_name: true,
            profilePhoto: true,
          },
        },

        courses: true,
      },
    });
    if (!lessons) {
      res.status(404).json({
        isSuccess: false,
        message: "no lessons found",
      });
      return;
    }
    res.status(200).json({
      isSuccess: true,
      message: "successfully fetched!",
      lessons,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const getOneLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    // check if the lesson exists
    const lesson = await prisma.lessons.findUnique({
      where: {
        id: lessonId,
      },
    });
    if (!lesson) {
      res.status(400).json({
        isSuccess: false,
        message: "lesson not found",
      });
      return;
    }
    res.status(200).json({
      isSuccess: true,
      message: "successfully fetched",
      lesson,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;

    // check if the lesson exists
    const lesson = await prisma.lessons.findUnique({
      where: {
        id: lessonId,
      },
    });
    if (!lesson) {
      res.status(400).json({
        isSuccess: false,
        message: "lesson not found",
      });
      return;
    }
    const deletingLesson = await prisma.lessons.delete({
      where: {
        id: lessonId,
      },
    });
    res.status(200).json({
      isSuccess: true,
      message: "succesfully deleted",
      deletingLesson,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};
