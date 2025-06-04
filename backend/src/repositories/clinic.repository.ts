import {
    IClinic,
    IClinicDTO,
    IClinicFilter,
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

    private getBaseQuery(query: any, filter?: IClinicFilter) {
        // Перевіряємо чи filter існує
        const servicesPopulate = {
            ...this.defaultSelect.servicesPopulate,
            match: filter?.serviceName
                ? { name: { $regex: filter.serviceName, $options: "i" } }
                : {},
        };

        const doctorsPopulate = {
            ...this.defaultSelect.doctorsPopulate,
            match: filter?.doctorName
                ? {
                      $or: [
                          {
                              firstName: {
                                  $regex: filter.doctorName,
                                  $options: "i",
                              },
                          },
                          {
                              lastName: {
                                  $regex: filter.doctorName,
                                  $options: "i",
                              },
                          },
                      ],
                  }
                : {},
        };

        const baseQuery = query
            .select(this.defaultSelect.select)
            .populate(doctorsPopulate)
            .populate(servicesPopulate);

        if (filter?.sortDirection) {
            baseQuery.sort({ name: filter.sortDirection === "asc" ? 1 : -1 });
        }

        return baseQuery;
    }

    public getAllClinics(filter?: IClinicFilter): Promise<IClinic[]> {
        const query = Clinic.find();

        // Якщо шукаємо за назвою послуги
        if (filter?.serviceName) {
            query.populate({
                path: "services",
                match: { name: { $regex: filter.serviceName, $options: "i" } },
            });
        }

        const clinics = this.getBaseQuery(query, filter).exec();

        // Фільтруємо клініки, які мають відповідні послуги
        if (filter?.serviceName) {
            return clinics.filter(
                (clinic: IClinic) => clinic.services.length > 0,
            );
        }
        if (filter?.doctorName) {
            return clinics.filter(
                (clinic: IClinic) => clinic.doctors.length > 0,
            );
        }

        return clinics;
    }

    public getClinicById(id: string): Promise<IClinic> {
        return this.getBaseQuery(Clinic.findById(id)).exec();
    }
    public getClinicsByNames(name: string, sortDirection?: string) {
        return this.getBaseQuery(
            Clinic.find({
                name: { $regex: name, $options: "i" },
            }),
            { sortDirection },
        ).exec();
    }
    public getClinicByName(name: string): Promise<IClinic> {
        return this.getBaseQuery(
            Clinic.findOne({ name: { $regex: new RegExp(name, "i") } }),
        ).exec();
    }
    public getClinicByExactName(name: string): Promise<IClinic> {
        return this.getBaseQuery(
            Clinic.findOne({
                name: {
                    $regex: `^${name}$`,
                    $options: "i",
                },
            }),
        ).exec();
    }

    public async createClinic(clinic: IClinicDTO): Promise<IClinic> {
        const createdClinic = await Clinic.create(clinic);
        return this.getBaseQuery(Clinic.findById(createdClinic._id)).exec();
    }

    public updateClinicById(
        id: string,
        dto: IClinicUpdateDTO,
    ): Promise<IClinic> {
        return this.getBaseQuery(
            Clinic.findByIdAndUpdate(id, dto, { new: true }),
        ).exec();
    }
    public deleteClinicById(id: string) {
        return Clinic.findByIdAndDelete(id);
    }
}

export const clinicRepository = new ClinicRepository();
