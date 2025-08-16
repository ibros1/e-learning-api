import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Create or Update Lesson Progress
export const markLessonProgress = async (req: Request, res: Response) => {
  try {
    const { userId, lessonId, courseId, isCompleted } = req.body;

    if (!userId || !lessonId || !courseId) {
      res.status(400).json({
        isSuccess: false,
        message: "Missing required fields",
      });
      return;
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        lessonId,
        courseId,
        isCompleted,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Lesson progress updated",
      progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error",
    });
  }
};

// Get Progress for One Lesson (per user)
export const getLessonProgress = async (req: Request, res: Response) => {
  try {
    const { userId, lessonId } = req.params;
    const numericUserId = Number(userId);

    if (isNaN(numericUserId)) {
      res.status(400).json({
        isSuccess: false,
        message: "Invalid user ID",
      });
      return;
    }

    const checkUser = await prisma.user.findUnique({
      where: {
        id: numericUserId,
      },
    });

    if (!checkUser) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }

    const checkLesson = await prisma.lessons.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!checkLesson) {
      res.status(404).json({
        isSuccess: false,
        message: "Lesson not found!",
      });
      return;
    }

    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: numericUserId,
          lessonId,
        },
      },
    });

    if (!progress) {
      res.status(404).json({
        isSuccess: false,
        message: "Progress not found",
      });
      return;
    }

    res.status(200).json({
      isSuccess: true,
      message: "Progress found",
      progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error",
    });
  }
};

// Get All Completed Lessons for a User
export const getCompletedLessons = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const checkUser = await prisma.user.findUnique({
      where: {
        id: +userId,
      },
    });

    if (!checkUser) {
      res.status(404).json({
        isSuccess: false,
        message: "user not found!",
      });
      return;
    }

    const completed = await prisma.lessonProgress.findMany({
      where: {
        userId: Number(userId),
        isCompleted: true,
      },
      include: {
        lesson: {
          select: {
            courses: {
              select: {
                title: true,
                course_img: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!completed) {
      res.status(404).json({
        isSuccess: false,
        message: "Completed not found!",
      });
      return;
    }

    res.status(200).json({
      isSuccess: true,
      message: "Fetched completed lessons",
      completed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error",
    });
  }
};
