import { IUser, IUserCreateDTO } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
    public create(user: IUserCreateDTO): Promise<IUser> {
        return User.create(user);
    }

    public getById(userId: string): Promise<IUser> {
        return User.findById(userId);
    }
    public getByEmail(email: string): Promise<IUser> {
        return User.findOne({ email });
    }
    public updateById(id: string, user: Partial<IUser>): Promise<IUser> {
        return User.findByIdAndUpdate(id, user, { new: true });
    }
}
export const userRepository = new UserRepository();
