import { Router } from "express";
import {
  createEnrollement,
  deleteEnroll,
  getAllEnrollements,
  getOneEnroll,
  updateEnrollement,
} from "../controllers/enrollementController";
import { authenticate } from "../../middleware/authenthicate.middleware";
import { validtionMidlleware } from "../../middleware/validation";
import { authorize } from "../../middleware/authorize";
const router = Router();

router.post("/create", createEnrollement);
router.put(
  "/update",
  authenticate,
  validtionMidlleware,
  authorize(["ADMIN"]),
  updateEnrollement
);
router.delete(
  "/delete/:enrollId",
  authenticate,
  validtionMidlleware,
  authorize(["ADMIN"]),
  deleteEnroll
);
router.get(
  "/list",
  authenticate,
  validtionMidlleware,

  getAllEnrollements
);
router.get("/:enrollId", getOneEnroll);

export default router;
