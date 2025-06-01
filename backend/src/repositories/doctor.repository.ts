import { IDoctor, IDoctorDTO } from "../interfaces/doctor.interface";
import { Doctor } from "../models/doctor.model";

class DoctorRepository {
    private readonly defaultPopulate = {
        doctorSelect: "firstName lastName clinics services",
        clinicPopulate: {
            path: "clinics",
            select: "_id name",
        },
        servicePopulate: {
            path: "services",
            select: "_id name",
        },
    };

    public getAllDoctors(): Promise<IDoctor[]> {
        return Doctor.find()
            .select(this.defaultPopulate.doctorSelect)
            .populate(this.defaultPopulate.clinicPopulate)
            .populate(this.defaultPopulate.servicePopulate)
            .exec();
    }

    public getDoctorById(id: string): Promise<IDoctor> {
        return Doctor.findById(id)
            .select(this.defaultPopulate.doctorSelect)
            .populate(this.defaultPopulate.clinicPopulate)
            .populate(this.defaultPopulate.servicePopulate)
            .exec();
    }

    public createDoctor(doctor: IDoctorDTO): Promise<IDoctor> {
        return Doctor.create(doctor);
    }

    public getDoctorsByClinic(clinicId: string): Promise<IDoctor[]> {
        return Doctor.find({ clinics: clinicId })
            .select(this.defaultPopulate.doctorSelect)
            .populate(this.defaultPopulate.clinicPopulate)
            .populate(this.defaultPopulate.servicePopulate)
            .exec();
    }

    public getDoctorsByService(serviceId: string): Promise<IDoctor[]> {
        return Doctor.find({ services: serviceId })
            .select(this.defaultPopulate.doctorSelect)
            .populate(this.defaultPopulate.clinicPopulate)
            .populate(this.defaultPopulate.servicePopulate)
            .exec();
    }
}

export const doctorRepository = new DoctorRepository();
