import { IBase } from "./base.interface";
import { IClinic } from "./clinic.interface";
import { IService } from "./service.interface";

export interface IDoctor extends IBase {
    _id: string;
    firstName: string;
    lastName: string;
    clinics: IClinic[] | string[];
    services: IService[] | string[];
}
export type IDoctorDTO = {
    firstName: string;
    lastName: string;
    clinics: string | string[];
    services: string | string[];
};
export interface IUpdateDoctorDTO extends Partial<IDoctorDTO> {
    clinics?: string | string[];
    services?: string | string[];
}
