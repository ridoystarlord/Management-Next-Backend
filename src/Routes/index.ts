import { Router } from "express";

import SuperAdminRoutes from "./SuperAdminRoutes";
import UserRoutes from "./UserRoutes";

const router = Router();

router.use("/user", UserRoutes);
router.use("/super-admin", SuperAdminRoutes);

export default router;
