import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import {
  iCreatedUser,
  iLogingUser,
  iUpdatedRole,
  iUpdatedUser,
} from "../../types/user.interface";
import argon2, { hash } from "argon2";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../types/request";
import { generateWebToken } from "../../helpers/jwt";
import { saveBase64Image } from "../constants/base64Img";
import { deleteFromCloudinary, getPublicIdFromUrl } from "../utils/cloudinary";
const Prisma = new PrismaClient();
// Helper to save base64 image

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;
    console.log(data);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Get Cloudinary URLs
    const profilePhoto = files?.profilePhoto?.[0]?.path;
    const coverPhoto = files?.coverPhoto?.[0]?.path;

    // Validate required fields
    const requiredFields = [
      "email",
      "password",
      "username",
      "fullName",
      "phone_number",
      "comfirmPassword",
      "sex",
    ];

    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0 || !profilePhoto || !coverPhoto) {
      res.status(400).json({
        isSuccess: false,
        message: `Missing required fields: ${[
          ...missingFields,
          !profilePhoto ? "profilePhoto" : "",
          !coverPhoto ? "coverPhoto" : "",
        ]
          .filter(Boolean)
          .join(", ")}`,
      });
      return;
    }

    // // Validate all required fields
    // if (
    //   !data.email ||
    //   !data.password ||
    //   !data.username ||
    //   !data.fullName ||
    //   !data.phone_number ||
    //   !data.comfirmPassword ||
    //   !profilePhoto ||
    //   !coverPhoto ||
    //   !data.sex
    // ) {
    //   res.status(400).json({
    //     isSuccess: false,
    //     message: "Please provide all required fields",
    //   });
    //   return;
    // }

    // Check password match
    if (data.password !== data.comfirmPassword) {
      res.status(400).json({
        isSuccess: false,
        message: "Password and confirm password do not match",
      });
      return;
    }

    // Check if email exists
    const userExists = await Prisma.user.findFirst({
      where: { email: data.email.toLowerCase() },
    });

    if (userExists) {
      res.status(400).json({
        isSuccess: false,
        message: "User with this email already exists",
      });
      return;
    }

    // Check if username exists
    // In createUser function:
    const usernameTaken = await Prisma.user.findFirst({
      where: {
        username: {
          equals: data.username,
          mode: "insensitive",
        },
      },
    });
    if (usernameTaken) {
      res.status(400).json({
        isSuccess: false,
        message: "Username is already taken!",
      });
      return;
    }

    // Hash password
    const hashedPassword = await argon2.hash(data.password);

    // Create new user
    const newUser = await Prisma.user.create({
      data: {
        username: data.username,
        email: data.email.toLowerCase(),
        full_name: data.fullName,
        is_active: true,
        phone_number: data.phone_number,
        password: hashedPassword,
        profilePhoto,
        coverPhoto,
        sex: data.sex.toUpperCase(),
      },
    });

    const { password, ...rest } = newUser;

    res.status(201).json({
      isSuccess: true,
      message: "Successfully created user",
      user: rest,
    });
  } catch (error) {
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      await Promise.all([
        deleteFromCloudinary(files?.profilePhoto?.[0]?.filename),
        deleteFromCloudinary(files?.coverPhoto?.[0]?.filename),
      ]);
    }
    console.error("Create user error:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error",
    });
    return;
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await Prisma.user.findMany({
      include: {
        enrollements: true,
        courses: true,
      },
    });
    if (!users) {
      res.status(404).json({
        isSuccess: false,
        message: "no users found!",
      });
      return;
    }

    const sanitizedUsers = users.map(({ password, ...rest }) => rest);
    res.status(200).json({
      isSuccess: true,
      message: "successfully fetched!",
      users: sanitizedUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSucccess: false,
      message: "server error",
    });
  }
};

export const getOneUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // check if the user is exist
    const user = await Prisma.user.findFirst({
      where: {
        id: +userId,
      },
    });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "user not found!",
      });
      return;
    }
    const { password, ...rest } = user;
    res.status(200).json({
      isSuccess: true,
      message: "success",
      user: rest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body as iUpdatedUser;
    console.log(data);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Halkaan waxaad helaysaa URL-ada Cloudinary
    const profilePhoto = files?.profilePhoto?.[0]?.path;
    const coverPhoto = files?.coverPhoto?.[0]?.path;

    if (
      !data.id ||
      !data.username ||
      !data.email ||
      !data.fullName ||
      !data.phone_number
    ) {
      res.status(400).json({
        isSuccess: false,
        message: "validating error",
      });
      return;
    }

    const existingUser = await Prisma.user.findFirst({
      where: { id: Number(data.id) },
    });

    if (!existingUser) {
      res.status(404).json({
        isSuccess: false,
        message: "user is not exist",
      });
      return;
    }

    const hashedPassword = await argon2.hash(data.password);

    const updatedUser = await Prisma.user.update({
      where: { id: Number(data.id) },
      data: {
        username: data.username,
        email: data.email,
        full_name: data.fullName,
        phone_number: data.phone_number,
        password: hashedPassword,
        ...(profilePhoto && { profilePhoto }),
        ...(coverPhoto && { coverPhoto }),
      },
    });

    const { password, ...rest } = updatedUser;

    res.status(202).json({
      isSuccess: true,
      messsage: "success",
      updatedUser: rest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await Prisma.user.findFirst({
      where: {
        id: +userId,
      },
    });
    if (user) {
      // Delete user's images from Cloudinary
      await Promise.all([
        deleteFromCloudinary(getPublicIdFromUrl(user.profilePhoto)!),
        deleteFromCloudinary(getPublicIdFromUrl(user.coverPhoto)!),
      ]);
    }

    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found",
      });
      return;
    }

    // Delete enrollments
    const enrollements = await Prisma.enrollment.findMany({
      where: {
        userId: user.id,
      },
    });

    const enrolleIds = enrollements.map((enrl) => enrl.id);

    if (enrolleIds.length > 0) {
      await Prisma.enrollment.deleteMany({
        where: {
          id: { in: enrolleIds },
        },
      });
    }

    // Get the courses created by the user
    const userCourses = await Prisma.course.findMany({
      where: {
        userId: user.id,
      },
      select: { id: true },
    });

    const courseIds = userCourses.map((course) => course.id);

    if (courseIds.length > 0) {
      // Delete all lessons linked to the user's courses
      await Prisma.lessons.deleteMany({
        where: {
          courseId: { in: courseIds },
        },
      });

      // Delete chapters of user's courses
      await Prisma.chapter.deleteMany({
        where: {
          courseId: { in: courseIds },
        },
      });

      // Now it's safe to delete the courses
      await Prisma.course.deleteMany({
        where: {
          id: { in: courseIds },
        },
      });
    }

    // Delete the user finally
    const deletingUser = await Prisma.user.delete({
      where: {
        id: +userId,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Successfully deleted!",
      deletingUser,
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const data: iLogingUser = req.body;
    // check the email is correct

    const user = await Prisma.user.findFirst({
      where: {
        email: data.email.toLowerCase(),
      },
    });
    if (!user) {
      res.status(401).json({
        isSuccess: false,
        message: "Incorrect Email",
      });
      return;
    }

    // check the password is correct
    const isPasswordCorrect = await argon2.verify(user.password, data.password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        isSuccess: false,
        message: "Incorrect Password",
      });
      return;
    }
    const token = generateWebToken(user.id);
    const { password, ...rest } = user;
    res.status(200).json({
      isSuccess: true,
      message: "successfully loging in",
      user: rest,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "server error",
    });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const data: iUpdatedRole = req.body;

    if (!data.email || !data.role) {
      res.status(400).json({
        isSuccess: false,
        message: "Feilds of updating role is required",
      });
      return;
    }
    const checkUser = await Prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!checkUser) {
      res.status(401).json({
        isSuccess: false,
        message: "anAuthorized",
      });
      return;
    }

    const user = await Prisma.user.update({
      where: {
        email: data.email,
      },
      data: {
        role: data.role,
      },
      include: {
        courses: {
          select: {
            id: true,
            userId: true,
            course_img: true,
            cover_img: true,

            preview_course_url: true,
            title: true,
            description: true,
            is_published: true,
            price: true,
            created_at: true,
            updated_at: true,
            chapters: true,
            users: true,
          },
        },

        lesson: true,
        enrollements: {
          include: {
            course: true,
          },
        },
      },
    });

    const { password, ...rest } = checkUser;

    res.status(200).json({
      isSuccess: true,
      message: "use role updated successfully",
      user: rest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: "Server Error",
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        isSuccess: false,
        message: "an authorized",
      });
      return;
    }
    const user = await Prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollements: {
          include: {
            course: {
              include: {
                chapters: {
                  include: {
                    lesson: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { password, ...rest } = user;

    res.status(200).json({ isSuccess: true, user: rest });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
