
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { listNotifications, markAllRead, markOneRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", requireAuth(), asyncHandler(listNotifications));

router.post("/read-all", requireAuth(), asyncHandler(markAllRead));
router.patch("/read-all", requireAuth(), asyncHandler(markAllRead));

router.post("/:id/read", requireAuth(), asyncHandler(markOneRead));
router.patch("/:id/read", requireAuth(), asyncHandler(markOneRead));

export default router;
