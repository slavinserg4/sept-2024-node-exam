import { IBase } from "./base.interface";

export interface IClinic extends IBase {
    _id: string;
    name: string;
    services: string[];
    doctors: string[];
}
export type IClinicDTO = Pick<IClinic, "name">;
export type IClinicUpdateDTO = Pick<IClinic, "services" | "doctors">;
