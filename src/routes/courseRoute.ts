import { NextFunction, Request, Response, Router } from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getOneCourse,
  updateCourse,
} from "../controllers/coursesController";
import {
  registerCourseSchema,
  UpdateCourseSchema,
} from "../../schema/courseSchema";
import { validtionMidlleware } from "../../middleware/validation";
import { authenticate } from "../../middleware/authenthicate.middleware";
import multer from "multer";
import path from "path";
import { upload } from "../../middleware/upload";
import { authorize } from "../../middleware/authorize";
import { extractFileNames } from "../../middleware/extractFileNames";
// Configure storage for uploaded files (adjust destination as needed)

const router = Router();

router.post(
  "/create",
  upload.fields([
    { name: "course_img", maxCount: 1 },
    { name: "cover_img", maxCount: 1 },
  ]),
  authenticate,

  authorize(["ADMIN"]),
  createCourse
);
router.get("", getAllCourses);
router.put(
  "/update",
  upload.fields([
    { name: "course_img", maxCount: 1 },
    { name: "cover_img", maxCount: 1 },
  ]),
  authenticate,

  authorize(["ADMIN"]),
  UpdateCourseSchema,
  updateCourse
);

router.get("/:courseId", getOneCourse);
router.delete(
  "/delete/:courseId",
  authenticate,

  authorize(["ADMIN"]),
  deleteCourse
);
export default router;
