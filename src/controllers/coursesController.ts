import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { iCreatedCourse, iUpdatedCourse } from "../../types/course.interface";
import { AuthRequest } from "../../types/request";
import { saveBase64Image } from "../constants/base64Img";
import { deleteFromCloudinary, getPublicIdFromUrl } from "../utils/cloudinary";

const prisma = new PrismaClient();

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const data: iCreatedCourse = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const course_img = files?.course_img?.[0]?.path;
    const cover_img = files?.cover_img?.[0]?.path;
    // // Base64 fallback
    // if (!course_img && data.course_img?.startsWith("data:image")) {
    //   course_img = saveBase64Image(data.course_img, `course_img-${Date.now()}`);
    // }

    // if (!cover_img && data.cover_img?.startsWith("data:image")) {
    //   cover_img = saveBase64Image(data.cover_img, `cover_img-${Date.now()}`);
    // }
    if (
      !data.title ||
      !course_img ||
      !cover_img ||
      !data.preview_course ||
      data.isPublished === undefined ||
      data.price === undefined
    ) {
      res.status(400).json({
        isSuccess: false,
        message: "Validating course error: missing or invalid fields",
      });
      return;
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });
    if (!user) {
      res.status(400).json({
        isSuccess: false,
        message: "Can't create course because user doesn't exist",
      });
      return;
    }
    const isPublished =
      typeof data.isPublished === "boolean"
        ? data.isPublished
        : data.isPublished === "true";

    const course = await prisma.course.create({
      data: {
        userId: req.userId!,
        course_img: course_img,
        cover_img: cover_img,
        preview_course_url: data.preview_course,
        title: data.title,
        description: data.description,
        is_published: isPublished,
        price: parseFloat(data.price.toString()),
      },
    });

    res.status(201).json({
      isSuccess: true,
      message: "Successfully created!",
      course,
    });
  } catch (error) {
    if (req.files) {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      await Promise.all([
        deleteFromCloudinary(files?.course_img?.[0]?.filename),
        deleteFromCloudinary(files?.cover_img?.[0]?.filename),
      ]);
    }
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
  }
};

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        chapters: {
          include: {
            lesson: true,
          },
        },
        enrollments: true,
        users: {
          select: {
            id: true,
            username: true,
            email: true,
            full_name: true,
            profilePhoto: true,
          },
        },
      },
    });
    if (!courses) {
      res.status(404).json({
        isSuccess: false,
        message: "no course found!",
      });
      return;
    }
    res.status(200).json({
      isSuccess: true,
      message: "success",
      courses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const data: iUpdatedCourse = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const course_img = files?.course_img?.[0]?.path;
    const cover_img = files?.cover_img?.[0]?.path;

    // Base64 fallback
    // if (!course_img && data.course_img?.startsWith("data:image")) {
    //   course_img = saveBase64Image(data.course_img, `course_img-${Date.now()}`);
    // }

    // if (!cover_img && data.cover_img?.startsWith("data:image")) {
    //   cover_img = saveBase64Image(data.cover_img, `cover_img-${Date.now()}`);
    // }
    if (
      !data.title ||
      !data.description ||
      data.isPublished === undefined ||
      data.price === undefined ||
      !data.preview_course
    ) {
      res.status(400).json({
        isSuccess: false,
        message: "validating course error",
      });
      return;
    }

    const courseId = await prisma.course.findUnique({
      where: {
        id: Number(data.id),
      },
    });
    if (!courseId) {
      res.status(404).json({
        isSuccess: false,
        message: "course not found",
      });
      return;
    }
    const isPublished =
      typeof data.isPublished === "boolean"
        ? data.isPublished
        : data.isPublished === "true";

    const updatingCourse = await prisma.course.update({
      where: {
        id: +data.id,
      },
      data: {
        title: data.title,
        course_img: course_img,
        cover_img: cover_img,
        preview_course_url: data.preview_course,
        description: data.description,
        is_published: isPublished,
        price: Number(data.price),
      },
    });
    res.status(200).json({
      isSuccess: true,
      message: "success",
      updatingCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const getOneCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    // check if te course exists
    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(courseId),
      },
      include: {
        chapters: true,
        enrollments: true,
        lesson: true,
        users: true,
      },
    });
    if (!course) {
      res.status(404).json({
        isSuccess: false,
        message: "course not found!",
      });
      return;
    }
    res.status(200).json({
      isSuccess: true,
      message: "success",
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: +courseId },
    });

    if (!course) {
      res.status(404).json({
        isSuccess: false,
        message: "course not found",
      });
      return;
    }

    // 1. Find and delete all related lessons (by chapterId)
    const chapters = await prisma.chapter.findMany({
      where: { courseId: course.id },
    });
    const chapterIds = chapters.map((ch) => ch.id);

    await prisma.lessons.deleteMany({
      where: {
        chapterId: { in: chapterIds },
      },
    });

    // 2. Delete chapters
    await prisma.chapter.deleteMany({
      where: {
        courseId: course.id,
      },
    });

    // 3. Delete enrollments
    await prisma.enrollment.deleteMany({
      where: {
        courseId: course.id,
      },
    });
    // 4. Delete payments (fix foreign key error)
    await prisma.payment.deleteMany({
      where: { courseId: course.id },
    });

    if (course) {
      // Delete course images from Cloudinary
      await Promise.all([
        deleteFromCloudinary(getPublicIdFromUrl(course.course_img)!),
        deleteFromCloudinary(getPublicIdFromUrl(course.cover_img!)!),
      ]);
    }

    // 4. Finally delete the course
    const deletingCourse = await prisma.course.delete({
      where: { id: +courseId },
    });

    res.status(202).json({
      isSuccess: true,
      message: "Successfully deleted!",
      deletingCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error",
    });
    return;
  }
};
