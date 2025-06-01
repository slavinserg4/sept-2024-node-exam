import {
    IClinic,
    IClinicDTO,
    IClinicUpdateDTO,
} from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";

class ClinicRepository {
    private readonly defaultSelect = {
        select: "name doctors services",
        doctorsPopulate: {
            path: "doctors",
            select: "_id firstName lastName services",
            populate: {
                path: "services",
                select: "_id name",
            },
        },
        servicesPopulate: {
            path: "services",
            select: "_id name",
        },
    };

    private getBaseQuery(query: any) {
        return query
            .select(this.defaultSelect.select)
            .populate(this.defaultSelect.doctorsPopulate)
            .populate(this.defaultSelect.servicesPopulate);
    }

    public async getAllClinics(): Promise<IClinic[]> {
        return this.getBaseQuery(Clinic.find()).exec();
    }

    public async getClinicById(id: string): Promise<IClinic> {
        return this.getBaseQuery(Clinic.findById(id)).exec();
    }

    public async getClinicByName(name: string): Promise<IClinic> {
        return this.getBaseQuery(
            Clinic.findOne({ name: { $regex: new RegExp(name, "i") } }),
        ).exec();
    }

    public async createClinic(clinic: IClinicDTO): Promise<IClinic> {
        const createdClinic = await Clinic.create(clinic);
        return this.getBaseQuery(Clinic.findById(createdClinic._id)).exec();
    }

    public async updateClinicById(
        id: string,
        dto: IClinicUpdateDTO,
    ): Promise<IClinic> {
        return this.getBaseQuery(
            Clinic.findByIdAndUpdate(id, dto, { new: true }),
        ).exec();
    }
}

export const clinicRepository = new ClinicRepository();
