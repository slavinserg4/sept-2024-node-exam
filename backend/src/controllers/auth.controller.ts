import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { IUserCreateDTO } from "../interfaces/user.interface";
import { authService } from "../services/autn.service";

class AuthController {
    public async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as IUserCreateDTO;
            const data = await authService.signUp(body);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }
    public async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as IAuth;
            const data = await authService.signIn(body);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }
    public async recoveryRequest(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { email } = req.body;
            await authService.recoveryPasswordRequest(email);
            res.status(StatusCodesEnum.OK).json({
                details: "Check your email",
            });
        } catch (e) {
            next(e);
        }
    }
    public async recoveryPassword(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { token } = req.params as { token: string };
            const { password } = req.body;
            const user = await authService.recoveryPassword(token, password);
            res.status(StatusCodesEnum.OK).json(user);
        } catch (e) {
            next(e);
        }
    }
    public async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = req.res.locals.tokenPayload as ITokenPayload;
            const tokens = await authService.refresh(payload);
            res.status(StatusCodesEnum.OK).json(tokens);
        } catch (e) {
            next(e);
        }
    }
}
export const authController = new AuthController();
