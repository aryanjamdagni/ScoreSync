// import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
// import { listStoresForUser, rateStore } from "../controllers/userController.js";

// const router = express.Router();

// router.get("/stores", authMiddleware, listStoresForUser);
// router.post("/stores/:storeId/rate", authMiddleware, rateStore);

// export default router;

import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { listStoresPublicSchema, rateStoreSchema } from "../validators/store.validators.js";
import { listStoresForUser, rateStore } from "../controllers/userController.js";

const router = Router();

router.get("/stores", requireAuth(["USER"]), validate(listStoresPublicSchema), asyncHandler(listStoresForUser));
router.put("/stores/:storeId/rating", requireAuth(["USER"]), validate(rateStoreSchema), asyncHandler(rateStore));

export default router;
