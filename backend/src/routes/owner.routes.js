import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { OwnerController } from "../controllers/owner.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/dashboard", requireAuth(["OWNER"]), asyncHandler(OwnerController.dashboard));

export default router;
