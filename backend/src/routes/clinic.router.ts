import { Router } from "express";

import { clinicController } from "../controllers/clinic.controller";
import { authMiddleware } from "../middlewares/auth.middlware";

const router = Router();

router.get(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    clinicController.getAllClinics,
);
router.get(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    clinicController.getClinicById,
);
router.post(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    clinicController.createClinic,
);
export const clinicRouter = router;
