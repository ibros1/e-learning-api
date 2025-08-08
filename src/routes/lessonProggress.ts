import express from "express";
import {
  getCompletedLessons,
  getLessonProgress,
  markLessonProgress,
} from "../controllers/lessonProgrress";

const router = express.Router();

router.post("/", markLessonProgress); // Create/update
router.get("/completed/:userId", getCompletedLessons); // All completed
router.get("/:userId/:lessonId", getLessonProgress); // Get 1

export default router;
