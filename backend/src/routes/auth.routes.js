import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, changePasswordSchema } from "../validators/auth.validators.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(AuthController.register));
router.post("/login", validate(loginSchema), asyncHandler(AuthController.login));
router.get("/me", requireAuth(), asyncHandler(AuthController.me));
router.patch("/change-password", requireAuth(), validate(changePasswordSchema), asyncHandler(AuthController.changePassword));

export default router;
