import { RoleEnum } from "../enums/role.enum";
import { IBase } from "./base.interface";
import { IClinic } from "./clinic.interface";
import { IService } from "./service.interface";

export interface IDoctor extends IBase {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: RoleEnum;
    clinics: IClinic[] | string[];
    services: IService[] | string[];
}
export type IDoctorDTO = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    clinics: string | string[];
    services: string | string[];
};
export interface IUpdateDoctorDTO extends Partial<IDoctorDTO> {
    clinics?: string | string[];
    services?: string | string[];
}
export type IDoctorFind = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
};
export interface IDoctorFilter extends IDoctorFind {
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortDirection?: string;
}
