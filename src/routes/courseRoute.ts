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
import { courseUpload } from "../utils/cloudinary";
import { authorize } from "../../middleware/authorize";
import { extractFileNames } from "../../middleware/extractFileNames";
import { multerErrorHandler } from "../../middleware/limit.image.middleWare";
// Configure storage for uploaded files (adjust destination as needed)

const router = Router();
router.use(multerErrorHandler);
router.post(
  "/create",
  courseUpload.fields([
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
  courseUpload.fields([
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
