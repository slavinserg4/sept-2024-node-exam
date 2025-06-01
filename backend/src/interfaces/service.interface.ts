import { IBase } from "./base.interface";

export interface IService extends IBase {
    _id: string;
    name: string;
    doctorId?: string[];
    clinicId?: string[];
}

export interface IServiceCreate {
    name?: string;
    doctorId?: string[];
    clinicId?: string[];
}

export type IServiceDTO = Pick<
    IServiceCreate,
    "name" | "doctorId" | "clinicId"
>;
