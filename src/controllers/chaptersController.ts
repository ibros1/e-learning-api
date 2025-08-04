import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  iCreatedChapter,
  iUpdatedChapter,
} from "../../types/chapter.interface";
const prisma = new PrismaClient();

export const createChapter = async (req: Request, res: Response) => {
  try {
    const data: iCreatedChapter = req.body;
    if (!data.userId || !data.courseId || !data.chapterTitle) {
      res.status(400).json({
        isSuccess: false,
        message: "Validating chapter error",
      });
      return;
    }

    const userId = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });
    if (!userId) {
      res.status(404).json({
        isSuccess: false,
        message: "user not found!",
      });
      return;
    }
    const courseId = await prisma.course.findUnique({
      where: {
        id: data.courseId,
      },
    });
    if (!courseId) {
      res.status(404).json({
        isSuccess: false,
        message: "course not found!",
      });
      return;
    }

    const createdChapter = await prisma.chapter.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        chapterTitle: data.chapterTitle,
      },
      include: {
        courses: true,
        
      },
      
    });
    res.status(200).json({
      isSuccess: false,
      message: "Succesfully created chapter!",
      createdChapter,
    });
  } catch (error) {
    console.error("Create Chapter Error:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error while creating chapter",
    });
    return;
  }
};

export const listAllChapter = async (req: Request, res: Response) => {
  try {
    const chapters = await prisma.chapter.findMany({
      include: {
        lesson: true,
        courses: true,
      },
    });
    if (!chapters) {
      res.status(404).json({
        isSuccess: false,
        message: "No Chapters found yet!",
      });

      return;
    }

    res.status(200).json({
      isSuccess: true,
      message: "Successfully fetched all chapters",
      chapters,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const getOneChapter = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },

      include: {
        lesson: true,
        courses: true,
      },
    });

    if (!chapter) {
      res.status(400).json({
        isSuccess: false,
        message: "Chapter is not exist!",
      });
      return;
    }

    res.status(200).json({
      isSuccess: true,
      message: "Success",
      chapter,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "Server Error",
    });
  }
};

export const updateChapter = async (req: Request, res: Response) => {
  try {
    const data: iUpdatedChapter = req.body;
    if (!data.courseId || !data.chapterTitle || !data.chapterId) {
      res.status(400).json({
        isSuccess: false,
        message: "Validating Chapter Error",
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
        message: "chapter not found!",
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
        message: "course not found!",
      });
      return;
    }

    const updatedChapter = await prisma.chapter.update({
      where: {
        id: data.chapterId,
      },
      data: {
        chapterTitle: data.chapterTitle,
        courseId: data.courseId,
      },
      include: {
        lesson: true,
        courses: true,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Successfully updated!",
      updatedChapter,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "Server Error",
    });
  }
};

export const deleteChapter = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });

    if (!chapter) {
      res.status(404).json({
        isSuccess: false,
        message: "chapter not found!",
      });
      return;
    }

    const deleteLessons = await prisma.lessons.deleteMany({
      where: {
        chapterId: chapterId,
      },
    });

    const deletedChapter = await prisma.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    res.status(201).json({
      isSuccess: true,
      message: "Successfully deleted course",
      deletedChapter,
      deleteLessons,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "Server Error",
    });
  }
};
