import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middlware";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { AuthValidator } from "../validators/auth.validator";
import { RecoveryValidator } from "../validators/recovery.validator";
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
    commonMiddleware.validateBody(RecoveryValidator.emailSchema),
    authController.recoveryRequest,
);
router.post(
    "/recovery/:token",
    commonMiddleware.validateBody(AuthValidator.validatePassword),
    authController.recoveryPassword,
);
router.post(
    "/refresh",
    commonMiddleware.validateBody(AuthValidator.refreshToken),
    authMiddleware.checkRefreshToken,
    authController.refresh,
);

export const authRouter = router;
