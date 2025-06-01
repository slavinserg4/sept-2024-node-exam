import { IDoctor, IDoctorDTO } from "../interfaces/doctor.interface";
import { Doctor } from "../models/doctor.model";

class DoctorRepository {
    public getAllDoctors(): Promise<IDoctor[]> {
        return Doctor.find().populate("clinics").populate("services").exec();
    }

    public getDoctorById(id: string): Promise<IDoctor> {
        return Doctor.findById(id)
            .populate("clinics")
            .populate("services")
            .exec();
    }

    public createDoctor(doctor: IDoctorDTO): Promise<IDoctor> {
        return Doctor.create(doctor);
    }

    public getDoctorsByClinic(clinicId: string): Promise<IDoctor[]> {
        return Doctor.find({ clinics: clinicId })
            .populate("clinics")
            .populate("services")
            .exec();
    }

    public getDoctorsByService(serviceId: string): Promise<IDoctor[]> {
        return Doctor.find({ services: serviceId })
            .populate("clinics")
            .populate("services")
            .exec();
    }
}
export const doctorRepository = new DoctorRepository();
