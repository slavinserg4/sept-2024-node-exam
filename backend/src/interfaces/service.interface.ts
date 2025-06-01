import { IBase } from "./base.interface";
import { IClinic } from "./clinic.interface";
import { IDoctor } from "./doctor.interface";

export interface IService extends IBase {
    _id: string;
    name: string;
    doctorId?: IDoctor[] | string[];
    clinicId?: IClinic[] | string[];
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
