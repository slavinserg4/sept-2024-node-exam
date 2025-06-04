import { RegexEnum } from "../enums/regex.enum";
import {
    IDoctor,
    IDoctorDTO,
    IDoctorFind,
    IUpdateDoctorDTO,
} from "../interfaces/doctor.interface";
import { Doctor } from "../models/doctor.model";

class DoctorRepository {
    private readonly defaultSelect = {
        select: "firstName lastName email phone clinics services",
        clinicPopulate: {
            path: "clinics",
            select: "_id name",
        },
        servicePopulate: {
            path: "services",
            select: "_id name",
        },
    };

    private getBaseQuery(
        query: any,
        sortField?: string,
        sortDirection?: string,
    ) {
        const baseQuery = query
            .select(this.defaultSelect.select)
            .populate(this.defaultSelect.clinicPopulate)
            .populate(this.defaultSelect.servicePopulate);

        if (sortField && sortDirection) {
            baseQuery.sort({ [sortField]: sortDirection === "asc" ? 1 : -1 });
        }
        return baseQuery;
    }

    public getDoctorByEmailWithPassword(email: string): Promise<IDoctor> {
        return Doctor.findOne({ email })
            .select(this.defaultSelect.select + " password role") // додаємо password і role
            .populate(this.defaultSelect.clinicPopulate)
            .populate(this.defaultSelect.servicePopulate)
            .exec();
    }

    public getAllDoctors(
        sortField?: string,
        sortDirection?: string,
    ): Promise<IDoctor[]> {
        return this.getBaseQuery(
            Doctor.find(),
            sortField,
            sortDirection,
        ).exec();
    }

    public getDoctorById(id: string): Promise<IDoctor> {
        return this.getBaseQuery(Doctor.findById(id)).exec();
    }

    public searchDoctors(
        searchParams: IDoctorFind,
        sortField?: string,
        sortDirection?: string,
    ): Promise<IDoctor[]> {
        const searchQuery = Object.entries(searchParams)
            .filter(([, value]) => value)
            .reduce((acc, [key, value]) => {
                if (key === "phone") {
                    // Видаляємо всі спеціальні символи та пробіли для порівняння
                    const cleanedValue = value.replace(
                        RegexEnum.PHONE_CLEANER,
                        "",
                    );
                    return {
                        ...acc,
                        [key]: {
                            $regex: cleanedValue.split("").join(".*"),
                            $options: "i",
                        },
                    };
                }
                return {
                    ...acc,
                    [key]: { $regex: value, $options: "i" },
                };
            }, {});

        return this.getBaseQuery(
            Doctor.find(searchQuery),
            sortField,
            sortDirection,
        ).exec();
    }

    public async createDoctor(doctor: IDoctorDTO): Promise<IDoctor> {
        const createdDoctor = await Doctor.create(doctor);
        return this.getBaseQuery(Doctor.findById(createdDoctor._id)).exec();
    }

    public updateDoctorById(
        id: string,
        dto: IUpdateDoctorDTO,
    ): Promise<IDoctor> {
        return this.getBaseQuery(
            Doctor.findByIdAndUpdate(id, dto, { new: true }),
        ).exec();
    }

    public getDoctorByEmail(email: string): Promise<IDoctor> {
        return this.getBaseQuery(Doctor.findOne({ email })).exec();
    }
    public deleteDoctorById(id: string) {
        return this.getBaseQuery(Doctor.findByIdAndDelete(id));
    }
    public async updatePassword(
        id: string,
        password: string,
    ): Promise<IDoctor> {
        return await Doctor.findByIdAndUpdate(id, { password }, { new: true })
            .select("+password")
            .exec();
    }
}

export const doctorRepository = new DoctorRepository();
