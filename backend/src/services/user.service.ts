import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
    public async isEmailUnique(email: string): Promise<void> {
        const user = await userRepository.getByEmail(email);

        if (user) {
            throw new ApiError(
                "User is already exists",
                StatusCodesEnum.BED_REQUEST,
            );
        }
    }
    public async isUserAdmin(role: string): Promise<void> {
        if (role !== "admin") {
            throw new ApiError("User is not admin", StatusCodesEnum.FORBIDDEN);
        }
    }
    public async updateById(
        userId: string,
        user: Partial<IUser>,
    ): Promise<IUser> {
        const data = userRepository.getById(userId);
        if (!data) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }
        return await userRepository.updateById(userId, user);
    }
}
export const userService = new UserService();
