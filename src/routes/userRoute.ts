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
import { upload } from "../../middleware/upload";
import { authorize } from "../../middleware/authorize";

const router = Router();

router.post(
  "/create",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  registerUserSchema,
  validtionMidlleware,

  createUser
);

router.post("/login", loginUserSchema, validtionMidlleware, loginUser);
router.get("/list", getAllUsers);
router.get("/list/:userId", getOneUser);
router.put(
  "/update",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),

  updateUser
);

router.put(
  "/role/update",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  authenticate,
  authorize(["ADMIN"]),
  updateRole
);

router.get("/me", authenticate, getMe);
router.delete(
  "/delete/:userId",
  authenticate,
  authorize(["ADMIN"]),
  deleteUser
);

export default router;
