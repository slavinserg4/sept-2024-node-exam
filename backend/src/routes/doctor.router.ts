import { Router } from "express";

import { doctorController } from "../controllers/doctor.controller";
import { authMiddleware } from "../middlewares/auth.middlware";

const router = Router();

router.get("/", doctorController.getAllDoctors.bind(doctorController));
router.get("/:id", doctorController.getDoctorById.bind(doctorController));
router.post(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    doctorController.createDoctor.bind(doctorController),
);
router.post("/sign-in", doctorController.signInByDoctor.bind(doctorController));
router.patch(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    doctorController.updateDoctorById.bind(doctorController),
);
router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    doctorController.deleteDoctorById.bind(doctorController),
);

export const doctorRouter = router;
