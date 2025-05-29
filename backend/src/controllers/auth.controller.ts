import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IAuth } from "../interfaces/auth.interface";
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
}
export const authController = new AuthController();
