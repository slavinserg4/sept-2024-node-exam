import { Router } from "express";

import { doctorController } from "../controllers/doctor.controller";
import { authMiddleware } from "../middlewares/auth.middlware";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { DoctorValidator } from "../validators/doctor.validator";

const router = Router();

router.get(
    "/",
    commonMiddleware.validateQuery(DoctorValidator.getAllSchema),
    doctorController.getAllDoctors.bind(doctorController),
);
router.get(
    "/:id",
    commonMiddleware.isIdValidate("id"),
    doctorController.getDoctorById.bind(doctorController),
);
router.post(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    commonMiddleware.validateBody(DoctorValidator.createSchema),
    doctorController.createDoctor.bind(doctorController),
);
router.post("/sign-in", doctorController.signInByDoctor.bind(doctorController));
router.patch(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    commonMiddleware.isIdValidate("id"),
    doctorController.updateDoctorById.bind(doctorController),
);
router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.IsUserAdmin,
    commonMiddleware.isIdValidate("id"),
    doctorController.deleteDoctorById.bind(doctorController),
);

export const doctorRouter = router;
