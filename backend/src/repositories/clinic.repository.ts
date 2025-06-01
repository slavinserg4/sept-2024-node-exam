import {
    IClinic,
    IClinicDTO,
    IClinicUpdateDTO,
} from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";

class ClinicRepository {
    public getAllClinics(): Promise<IClinic[]> {
        return Clinic.find().populate("Service").populate("Doctor");
    }
    public createClinic(clinic: IClinicDTO): Promise<IClinic> {
        return Clinic.create(clinic);
    }
    public updateClinicById(
        id: string,
        dto: IClinicUpdateDTO,
    ): Promise<IClinic> {
        return Clinic.findByIdAndUpdate(id, dto);
    }
    public getClinicById(id: string): Promise<IClinic> {
        return Clinic.findById(id);
    }
    public getClinicByName(name: string): Promise<IClinic> {
        return Clinic.findOne({
            name: { $regex: new RegExp(name, "i") },
        });
    }
}
export const clinicRepository = new ClinicRepository();
