import { RoleEnum } from "../enums/role.enum";
import { IBase } from "./base.interface";

export interface IToken extends IBase {
    _id: string;
    accessToken: string;
    refreshToken: string;
    _userId: string;
}
interface ITokenPayload {
    userId: string;
    role: RoleEnum;
}
type ITokenModel = Pick<IToken, "accessToken" | "refreshToken" | "_userId">;
type ITokenPair = Pick<IToken, "accessToken" | "refreshToken">;
export { ITokenModel, ITokenPair, ITokenPayload };
