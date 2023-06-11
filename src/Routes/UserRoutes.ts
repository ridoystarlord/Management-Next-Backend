import { Router } from "express";

import {
  createNewMember,
  getUserProfile,
  login,
  updateUserProfile,
  memberList,
} from "../Controllers/UserControllers";
import CheckEmail from "../Middleware/CheckEmail";
import isAdminVerify from "../Middleware/isAdminVerify";
import TokenVerify from "../Middleware/TokenVerify";

const router = Router();

router.post("/login", login);
router.post(
  "/add-member",
  TokenVerify,
  isAdminVerify,
  CheckEmail,
  createNewMember
);
router.get("/profile", TokenVerify, getUserProfile);
router.patch("/update-profile", TokenVerify, updateUserProfile);
router.get("/list", TokenVerify, memberList);

export default router;
