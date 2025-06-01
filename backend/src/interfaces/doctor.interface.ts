import { IBase } from "./base.interface";

export interface IDoctor extends IBase {
    _id: string;
    firstName: string;
    lastName: string;
    clinics: string[];
    services: string[];
}
export type IDoctorDTO = Pick<
    IDoctor,
    "firstName" | "lastName" | "clinics" | "services"
>;
