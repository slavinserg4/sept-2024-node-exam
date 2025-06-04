import { emailConstants } from "../constants/email.constants";
import { EmailEnum } from "../enums/email.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { TokenTypeEnum } from "../enums/toket-type.enum";
import { ApiError } from "../errors/api.error";
import { IAuth } from "../interfaces/auth.interface";
import { IDoctor } from "../interfaces/doctor.interface";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { IUser, IUserCreateDTO } from "../interfaces/user.interface";
import { doctorRepository } from "../repositories/doctor.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { doctorService } from "./doctor.service";
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
            const doctor = await doctorRepository.getDoctorByEmail(email);
            if (!doctor) {
                throw new ApiError(
                    "Unable to perform password recovery",
                    StatusCodesEnum.NOT_FOUND,
                );
            }

            const token = tokenService.generateActionToken(
                { doctorId: doctor._id, role: doctor.role },
                TokenTypeEnum.RECOVERY,
            );

            await emailService.sendEmail(
                doctor.email,
                emailConstants[EmailEnum.RECOVERY],
                { url: `http://localhost:3000/recovery?token=${token}` },
            );

            return; // Важливо додати return тут
        }

        // Якщо знайдено користувача
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
    ): Promise<IUser | IDoctor> {
        const tokenPayload = tokenService.verifyToken(
            token,
            TokenTypeEnum.RECOVERY,
        );
        const hashedPassword = await passwordService.hashPassword(password);

        if (tokenPayload.userId) {
            return await userService.updateById(tokenPayload.userId, {
                password: hashedPassword,
            });
        }

        if (tokenPayload.doctorId) {
            return await doctorService.updateDoctorPassword(
                tokenPayload.doctorId,
                hashedPassword,
            );
        }

        throw new ApiError(
            "Invalid token payload",
            StatusCodesEnum.BED_REQUEST,
        );
    }
    public async refresh(payload: ITokenPayload): Promise<ITokenPair> {
        const { userId, doctorId, ...restPayload } = payload;

        if (!userId && !doctorId) {
            throw new ApiError(
                "Invalid token payload",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        /* eslint-disable @typescript-eslint/no-unused-vars */
        const { exp, iat, ...payloadWithoutExpiry } = restPayload;

        const tokens = tokenService.generateTokens({
            ...payloadWithoutExpiry,
            userId,
            doctorId,
        });

        if (userId) {
            await tokenRepository.create({
                ...tokens,
                _userId: userId,
            });
        } else if (doctorId) {
            await tokenRepository.create({
                ...tokens,
                _doctorId: doctorId,
            });
        }

        return tokens;
    }
}
export const authService = new AuthService();
