import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middlware";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.validateBody(UserValidator.create),
    authController.signUp,
);

router.post("/sign-in", authController.signIn);
router.post(
    "/recovery",
    commonMiddleware.validateBody(UserValidator.emailSchema),
    authController.recoveryRequest,
);
router.post(
    "/recovery/:token",
    commonMiddleware.validateBody(UserValidator.passwordSchema),
    authController.recoveryPassword,
);
router.post(
    "/refresh",
    authMiddleware.checkRefreshToken,
    authController.refresh,
);

export const authRouter = router;
