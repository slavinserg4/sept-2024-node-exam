import {
    IDoctor,
    IDoctorDTO,
    IUpdateDoctorDTO,
} from "../interfaces/doctor.interface";
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
    public updateDoctorById(
        id: string,
        dto: IUpdateDoctorDTO,
    ): Promise<IDoctor> {
        return Doctor.findByIdAndUpdate(id, dto, { new: true })
            .select(this.defaultPopulate.doctorSelect)
            .populate(this.defaultPopulate.clinicPopulate)
            .populate(this.defaultPopulate.servicePopulate)
            .exec();
    }
}

export const doctorRepository = new DoctorRepository();
