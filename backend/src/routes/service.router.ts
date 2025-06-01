import { Router } from "express";

import { serviceController } from "../controllers/service.controller";
import { authMiddleware } from "../middlewares/auth.middlware";

const router = Router();
router.get(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    serviceController.getAllServices,
);
router.get(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    serviceController.getServiceById,
);
router.post(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    serviceController.createService,
);
export const serviceRouter = router;
