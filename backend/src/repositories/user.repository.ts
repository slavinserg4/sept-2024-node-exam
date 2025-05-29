import { IUser, IUserCreateDTO } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
    public create(user: IUserCreateDTO): Promise<IUser> {
        return User.create(user);
    }

    public getById(userId: string): Promise<IUser> {
        return User.findById(userId);
    }
    public async getByEmail(email: string) {
        return await User.findOne({ email });
    }
}
export const userRepository = new UserRepository();
