import { RoleEnum } from "../enums/role.enum";
import { IBase } from "./base.interface";

export interface IToken extends IBase {
    _id: string;
    accessToken: string;
    refreshToken: string;
    _userId?: string;
    _doctorId?: string;
}
interface ITokenPayload {
    userId?: string;
    doctorId?: string;
    exp?: number;
    iat?: number;
    role: RoleEnum;
}
type ITokenModel = Pick<IToken, "accessToken" | "refreshToken"> & {
    _userId: string;
};

type ITokenModelWithDoctor = Pick<IToken, "accessToken" | "refreshToken"> & {
    _doctorId: string;
};

type ITokenPair = Pick<IToken, "accessToken" | "refreshToken">;
type IRefresh = Pick<IToken, "refreshToken">;
export {
    IRefresh,
    ITokenModel,
    ITokenModelWithDoctor,
    ITokenPair,
    ITokenPayload,
};
