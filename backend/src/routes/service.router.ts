import { Router } from "express";

import { serviceController } from "../controllers/service.controller";
import { authMiddleware } from "../middlewares/auth.middlware";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { ServiceValidator } from "../validators/service.validator";

const router = Router();
router.get(
    "/search",
    commonMiddleware.validateQuery(ServiceValidator.searchSchema),
    serviceController.getServiceByName,
);
router.get(
    "/:id",
    commonMiddleware.isIdValidate("id"),
    serviceController.getServiceById,
);
router.get(
    "/",
    commonMiddleware.validateQuery(ServiceValidator.getAllSchema),
    serviceController.getAllServices,
);

router.post(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    commonMiddleware.validateBody(ServiceValidator.createSchema),
    serviceController.createService,
);
router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    commonMiddleware.isIdValidate("id"),
    serviceController.deleteServiceById,
);

export const serviceRouter = router;
