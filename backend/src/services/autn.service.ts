import { emailConstants } from "../constants/email.constants";
import { EmailEnum } from "../enums/email.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { TokenTypeEnum } from "../enums/toket-type.enum";
import { ApiError } from "../errors/api.error";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPair } from "../interfaces/token.interface";
import { IUser, IUserCreateDTO } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

class AuthService {
    public async signUp(
        user: IUserCreateDTO,
    ): Promise<{ user: IUser; tokens: ITokenPair }> {
        await userService.isEmailUnique(user.email);
        const password = await passwordService.hashPassword(user.password);
        const newUser = await userRepository.create({ ...user, password });
        const tokens = tokenService.generateTokens({
            userId: newUser._id,
            role: newUser.role,
        });
        await tokenRepository.create({ ...tokens, _userId: newUser._id });
        return { user: newUser, tokens };
    }
    public async signIn(
        dto: IAuth,
    ): Promise<{ user: IUser; tokens: ITokenPair }> {
        const user = await userRepository.getByEmail(dto.email);
        if (!user) {
            throw new ApiError(
                "Invalid email or password",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }
        const isValidPassword = await passwordService.comparePassword(
            dto.password,
            user.password,
        );
        if (!isValidPassword)
            throw new ApiError(
                "Invalid email or password",
                StatusCodesEnum.UNAUTHORIZED,
            );
        const tokens = tokenService.generateTokens({
            userId: user._id,
            role: user.role,
        });
        await tokenRepository.create({ ...tokens, _userId: user._id });
        return { user, tokens };
    }
    public async recoveryPasswordRequest(email: string): Promise<void> {
        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ApiError(
                "Unable to perform password recovery",
                StatusCodesEnum.NOT_FOUND,
            );
        }
        const token = tokenService.generateActionToken(
            {
                userId: user._id,
                role: user.role,
            },
            TokenTypeEnum.RECOVERY,
        );
        const url = `http://localhost:3000/recovery?token=${token}`;
        await emailService.sendEmail(
            user.email,
            emailConstants[EmailEnum.RECOVERY],
            { url },
        );
    }
    public async recoveryPassword(
        token: string,
        password: string,
    ): Promise<IUser> {
        const { userId } = tokenService.verifyToken(
            token,
            TokenTypeEnum.RECOVERY,
        );
        const hashedPassword = await passwordService.hashPassword(password);
        return await userService.updateById(userId, {
            password: hashedPassword,
        });
    }
}
export const authService = new AuthService();
