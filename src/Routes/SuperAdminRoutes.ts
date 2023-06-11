import { Router } from "express";

import { createSuperAdmin } from "../Controllers/UserControllers";
import CheckEmail from "../Middleware/CheckEmail";

const router = Router();

router.post("/", CheckEmail, createSuperAdmin);

export default router;
