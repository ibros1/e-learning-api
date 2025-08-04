import { Router } from "express";
import {
  createLessons,
  deleteLesson,
  getAllLessons,
  getOneLesson,
  updateLessons,
} from "../controllers/lessonsController";

const router = Router();

router.post("/create", createLessons);
router.put("/update", updateLessons);
router.get("/list", getAllLessons);
router.get("/list/:lessonId", getOneLesson);
router.delete("/delete/:lessonId", deleteLesson);
export default router;
