import { IBase } from "./base.interface";
import { IDoctor } from "./doctor.interface";
import { IService } from "./service.interface";

export interface IClinic extends IBase {
    _id: string;
    name: string;
    services: IService[] | string[];
    doctors: IDoctor[] | string[];
}
export interface IClinicDTO {
    name: string;
    services?: string[];
    doctors?: string[];
}
export interface IClinicFilter {
    clinicName?: string;
    serviceName?: string;
    doctorName?: string;
    sortDirection?: string;
    page?: number;
    pageSize?: number;
}

export type IClinicUpdateDTO = {
    name?: string;
    services?: string[];
    doctors?: string[];
};
