import { RoleEnum } from "../enums/role.enum";
import { IBase } from "./base.interface";

export interface IUser extends IBase {
    _id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: RoleEnum;
}
type IUserCreateDTO = Pick<IUser, "email" | "password" | "name" | "surname">;
export { IUserCreateDTO };
