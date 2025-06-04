import { Router } from "express";

import { clinicController } from "../controllers/clinic.controller";
import { authMiddleware } from "../middlewares/auth.middlware";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { ClinicValidator } from "../validators/clinic.validator";

const router = Router();

router.get(
    "/",
    commonMiddleware.validateQuery(ClinicValidator.getAllSchema),
    clinicController.getAllClinics,
);
router.get(
    "/:id",
    commonMiddleware.isIdValidate("id"),
    clinicController.getClinicById,
);
router.post(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    commonMiddleware.validateBody(ClinicValidator.createSchema),
    clinicController.createClinic,
);
router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    commonMiddleware.isIdValidate("id"),
    clinicController.deleteClinicById,
);
export const clinicRouter = router;
