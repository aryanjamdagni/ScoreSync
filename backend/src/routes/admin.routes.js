import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createUserSchema,
  listUsersSchema,
  createStoreSchema,
  listStoresSchema
} from "../validators/admin.validators.js";

const router = Router();

router.use(requireAuth(["ADMIN"]));

router.get("/stats", asyncHandler(AdminController.stats));

router.post("/users", validate(createUserSchema), asyncHandler(AdminController.createUser));
router.get("/users", validate(listUsersSchema), asyncHandler(AdminController.listUsers));

router.post("/stores", validate(createStoreSchema), asyncHandler(AdminController.createStore));
router.get("/stores", validate(listStoresSchema), asyncHandler(AdminController.listStores));

export default router;
