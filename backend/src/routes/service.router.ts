import { Router } from "express";

import { serviceController } from "../controllers/service.controller";
import { authMiddleware } from "../middlewares/auth.middlware";

const router = Router();
router.get("/search", serviceController.getServiceByName);
router.get("/:id", serviceController.getServiceById);
router.get("/", serviceController.getAllServices);

router.post(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    serviceController.createService,
);
router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    serviceController.deleteServiceById,
);

export const serviceRouter = router;
