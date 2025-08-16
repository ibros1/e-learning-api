import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getMe,
  getOneUser,
  loginUser,
  updateRole,
  updateUser,
} from "../controllers/userController";
import { loginUserSchema, registerUserSchema } from "../../schema/user";
import { validtionMidlleware } from "../../middleware/validation";
import { authenticate } from "../../middleware/authenthicate.middleware";
import { authorize } from "../../middleware/authorize";
import upload from "../../middleware/upload";
import { multerErrorHandler } from "../../middleware/limit.image.middleWare";
import { userUpload } from "../utils/cloudinary";
const router = Router();

// Apply multer error handler middleware first
router.use(multerErrorHandler);
router.post(
  "/create",
  // Process files FIRST
  userUpload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  // Then validate
  registerUserSchema,
  validtionMidlleware,
  createUser
);
router.post("/login", loginUserSchema, validtionMidlleware, loginUser);
router.get("/list", getAllUsers);
router.get("/list/:userId", getOneUser);

router.put(
  "/update",
  authenticate,
  userUpload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  updateUser
);

router.put("/role/update", authenticate, authorize(["ADMIN"]), updateRole);

router.get("/me", authenticate, getMe);
router.delete(
  "/delete/:userId",
  authenticate,
  authorize(["ADMIN"]),
  deleteUser
);

export default router;
