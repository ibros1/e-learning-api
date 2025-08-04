import { body } from "express-validator";
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();
export const registerUserSchema = [
  body("username")
    .isString()
    .isLength({ min: 2, max: 32 })
    .withMessage("Username must be between 2 and 12 characters.")
    .notEmpty(),

  body("email")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .notEmpty(),

  body("fullName") // Corrected from fullname to fullName
    .isString()
    .isLength({ min: 2, max: 30 })
    .withMessage("Full name must be between 2 and 30 characters.")
    .notEmpty(),

  body("phone_number")
    .isString()
    .isLength({ min: 7, max: 16 })
    .withMessage("Valid phone number is required.")
    .notEmpty(),

  body("password")
    .isString()
    .isLength({ min: 2, max: 64 })
    .withMessage("Password must be between 2 and 64 characters.")
    .notEmpty(),

  body("comfirmPassword")
    .isString()
    .isLength({ min: 2, max: 64 })
    .notEmpty()
    .withMessage("comfirm password is reuired to match password"),
];

export const loginUserSchema = [
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("password")
    .isString()
    .isLength({ min: 2, max: 64 })
    .withMessage("Password must be between 2 and 64 characters.")
    .notEmpty(),
];
