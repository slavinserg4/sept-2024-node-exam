import { Router } from "express";

import { clinicController } from "../controllers/clinic.controller";
import { authMiddleware } from "../middlewares/auth.middlware";

const router = Router();

router.get("/", clinicController.getAllClinics);
router.get("/:id", clinicController.getClinicById);
router.post(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    clinicController.createClinic,
);
router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    clinicController.deleteClinicById,
);
export const clinicRouter = router;
