import { Router } from "express";
import {
  createPayment,
  deletePayment,
  getAllPayments,
  getPaymentById,
} from "../controllers/paymentController";
const router = Router();

router.post("/create", createPayment);
router.get("/list", getAllPayments);
router.get("/:paymentId", getPaymentById);
router.delete("/delete/:paymentId", deletePayment);

export default router;
