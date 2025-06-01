import { Router } from "express";

import { doctorController } from "../controllers/doctor.controller";
import { authMiddleware } from "../middlewares/auth.middlware";

const router = Router();
router.get(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    doctorController.getAllDoctors,
);
router.get(
    "/:id",
    authMiddleware.checkAccessToken,
    doctorController.getDoctorById,
);
router.post(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    doctorController.createDoctor,
);
export const doctorRouter = router;
