import { RegexEnum } from "../enums/regex.enum";
import {
    IDoctor,
    IDoctorDTO,
    IDoctorFilter,
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

    public async getAllDoctors(
        filter?: IDoctorFilter,
    ): Promise<{ doctors: IDoctor[]; total: number }> {
        let baseQuery = Doctor.find();

        if (filter) {
            const searchQuery = Object.entries(filter)
                .filter(
                    ([key, value]) =>
                        value &&
                        ["firstName", "lastName", "phone", "email"].includes(
                            key,
                        ),
                )
                .reduce((acc, [key, value]) => {
                    if (key === "phone") {
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

            baseQuery = baseQuery.find(searchQuery);
        }

        const total = await Doctor.countDocuments(baseQuery.getFilter());

        if (filter?.sortField && filter?.sortDirection) {
            baseQuery = baseQuery.sort({
                [filter.sortField]: filter.sortDirection === "asc" ? 1 : -1,
            });
        }

        if (filter?.page && filter?.pageSize) {
            const skip = (filter.page - 1) * filter.pageSize;
            baseQuery = baseQuery.skip(skip).limit(filter.pageSize);
        }

        const doctors = await this.getBaseQuery(baseQuery).exec();

        return { doctors, total };
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
