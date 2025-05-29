import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
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
    public async isUserAdmin(userId: string): Promise<void> {
        const user = await userRepository.getById(userId);
        if (user.role !== "admin")
            throw new ApiError("User is not admin", StatusCodesEnum.FORBIDDEN);
    }
}
export const userService = new UserService();
