import { EnrollmentStatus, Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  icreatedEnrollment,
  iUpdatedEnrollment,
} from "../../types/enrollements.interface";
const prisma = new PrismaClient();

export const createEnrollement = async (req: Request, res: Response) => {
  try {
    const data: icreatedEnrollment = req.body;

    if (
      !data.userId ||
      !data.courseId ||
      data.isEnrolled === undefined ||
      !data.paymentId ||
      !Object.values(EnrollmentStatus).includes(data.status)
    ) {
      res.status(400).json({
        isSuccess: false,
        message: "validatingError",
      });
      return;
    }
    // check if the user is exists and course is exists
    const existingUser = await prisma.user.findFirst({
      where: {
        id: data.userId,
      },
    });

    if (!existingUser) {
      res.status(404).json({
        isSuccess: false,
        message: "user not existed",
      });
      return;
    }
    const existingCourse = await prisma.course.findFirst({
      where: {
        id: data.courseId,
      },
    });

    if (!existingCourse) {
      res.status(400).json({
        isSuccess: false,
        message: "course is not existed",
      });
      return;
    }
    const enrollement = await prisma.enrollment.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        progress: data.progress,
        status: data.status,
        is_enrolled: data.isEnrolled,
        paymentId: data.paymentId,
      },
      include: {
        course: true,
        users: {
          select: {
            full_name: true,
            profilePhoto: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "successfully enrolled",
      enrollement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const updateEnrollement = async (req: Request, res: Response) => {
  try {
    const data: iUpdatedEnrollment = req.body;

    if (
      !data.id ||
      !data.userId ||
      !Object.values(EnrollmentStatus).includes(data.status) ||
      data.isEnrolled === undefined ||
      !data.courseId
    ) {
      res.status(401).json({
        isSuccess: false,
        message: "validating error",
      });
      return;
    }

    const user = await prisma.user.findUnique({
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
    const enrllement = await prisma.enrollment.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!enrllement) {
      res.status(404).json({
        isSuccess: false,
        message: "enrollement not found!",
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

    const completedEnrollement = await prisma.enrollment.update({
      where: {
        id: data.id,
      },
      data: {
        status: data.status,
        is_enrolled: data.isEnrolled,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "successfully completed enrollement",
      completedEnrollement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const getOneEnroll = async (req: Request, res: Response) => {
  try {
    const { enrollId } = req.params;
    // check if the enrollement is exists
    const existEnrollement = await prisma.enrollment.findFirst({
      where: {
        id: enrollId,
      },
      include: {
        course: true,
        users: true,
      },
    });

    if (!existEnrollement) {
      res.status(404).json({
        isSuccess: false,
        message: "enrollement not found yet!",
      });
      return;
    }

    res.status(200).json({
      isSuccess: true,
      message: "successfully enrolled",
      existEnrollement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const getAllEnrollements = async (req: Request, res: Response) => {
  try {
    const enrollemnets = await prisma.enrollment.findMany({
      include: {
        users: {
          select: {
            profilePhoto: true,
            full_name: true,
            email: true,
            phone_number: true,
          },
        },
        course: {
          include: {
            chapters: true,
            lesson: true,
            enrollments: true,
          },
        },
      },
    });
    if (!enrollemnets) {
      res.status(404).json({
        isSuccess: false,
        message: "no enrollments has found!",
      });
      return;
    }
    res.status(200).json({
      isSuccess: true,
      message: "successfullt fetched!",
      enrollemnets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};
export const deleteEnroll = async (req: Request, res: Response) => {
  try {
    const { enrollId } = req.params;
    // check if the enrollement is exists
    const existEnrollement = await prisma.enrollment.findFirst({
      where: {
        id: enrollId,
      },
    });

    if (!existEnrollement) {
      res.status(404).json({
        isSuccess: false,
        message: "enrollement not found yet!",
      });
      return;
    }
    const deletingEnroll = await prisma.enrollment.delete({
      where: {
        id: enrollId,
      },
    });
    res.status(200).json({
      isSuccess: true,
      message: "successfully deleted!",
      deletingEnroll,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};
