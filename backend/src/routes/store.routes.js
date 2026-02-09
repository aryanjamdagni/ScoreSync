import { Router } from "express";
import { StoreController } from "../controllers/store.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { listStoresPublicSchema, rateStoreSchema } from "../validators/store.validators.js";

const router = Router();

router.get("/", requireAuth(["USER"]), validate(listStoresPublicSchema), asyncHandler(StoreController.listStoresForUser));
router.put("/:storeId/rating", requireAuth(["USER"]), validate(rateStoreSchema), asyncHandler(StoreController.rateStore));

export default router;
