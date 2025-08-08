import { Router } from "express";
import {
  createPayment,
  deletePayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
} from "../controllers/paymentController";
import { authenticate } from "../../middleware/authenthicate.middleware";
import { authorize } from "../../middleware/authorize";
const router = Router();

router.post("/create", authenticate, createPayment);
router.put("/update", authenticate, updatePayment);
router.get("/list", authenticate, authorize(["ADMIN"]), getAllPayments);
router.get("/:paymentId", authenticate, authorize(["ADMIN"]), getPaymentById);
router.delete(
  "/delete/:paymentId",
  authenticate,
  authorize(["ADMIN"]),
  deletePayment
);

export default router;
