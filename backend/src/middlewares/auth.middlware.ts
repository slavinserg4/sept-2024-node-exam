import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { TokenTypeEnum } from "../enums/toket-type.enum";
import { ApiError } from "../errors/api.error";
import { ITokenPayload } from "../interfaces/token.interface";
import { tokenService } from "../services/token.service";
import { userService } from "../services/user.service";

class AuthMiddleware {
    public async checkAccessToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                throw new ApiError(
                    "No token provided",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }
            const accessToken = authorizationHeader.split(" ")[1];
            if (!accessToken) {
                throw new ApiError(
                    "No token provided",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }
            const tokenPayload = tokenService.verifyToken(
                accessToken,
                TokenTypeEnum.ACCESS,
            );
            const isTokenExists = await tokenService.isTokenExists(
                accessToken,
                TokenTypeEnum.ACCESS,
            );
            if (!isTokenExists) {
                throw new ApiError(
                    "Invalid Token",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }
            res.locals.tokenPayload = tokenPayload;
            next();
        } catch (e) {
            next(e);
        }
    }
    public async IsUserAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenPayload = res.locals.tokenPayload as ITokenPayload;
            if (!tokenPayload) {
                throw new ApiError(
                    "No token provided",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }
            await userService.isUserAdmin(tokenPayload.role);
            next();
        } catch (e) {
            next(e);
        }
    }
}
export const authMiddleware = new AuthMiddleware();
