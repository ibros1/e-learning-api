import { body } from "express-validator";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export const registerCourseSchema = [
  body("title")
    .isString()
    .isLength({ min: 4, max: 170 })
    .withMessage(
      "The title of the course should be between 4 and 170 characters."
    )
    .notEmpty(),
];
export const UpdateCourseSchema = [
  body("title")
    .isString()
    .isLength({ min: 4, max: 170 })
    .withMessage(
      "The title of the course should be between 4 and 170 characters."
    )
    .notEmpty(),
];
