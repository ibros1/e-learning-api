import { body } from "express-validator";
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();
export const registerUserSchema = [
  body("username")
    .trim()
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")

    .notEmpty()
    .custom(async (value) => {
      const user = await Prisma.user.findFirst({
        where: {
          username: {
            equals: value,
            mode: "insensitive",
          },
        },
      });
      if (user) throw new Error("Username already taken");
    }),

  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Valid email required")
    .custom(async (value) => {
      const user = await Prisma.user.findFirst({
        where: { email: value },
      });
      if (user) throw new Error("Email already registered");
    }),

  body("fullName")
    .trim()
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be 2-50 characters"),

  body("phone_number")
    .trim()
    .isMobilePhone("any")
    .withMessage("Invalid phone number format"),

  body("sex")
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender selection"),

  body("password")
    .isString()
    .isLength({ min: 2, max: 64 })
    .withMessage("Password must be 2+ characters at least"),

  body("comfirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

export const loginUserSchema = [
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("password")
    .isString()
    .isLength({ min: 2, max: 64 })
    .withMessage("Password must be between 2 and 64 characters.")
    .notEmpty(),
];
