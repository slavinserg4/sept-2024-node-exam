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

    public async getAllClinics(filter?: IClinicFilter): Promise<IClinic[]> {
        let query = Clinic.find();

        if (filter?.clinicName) {
            query = query.where("name", {
                $regex: filter.clinicName,
                $options: "i",
            });
        }
        let results = await this.getBaseQuery(query, filter).exec();

        // Фільтрація за сервісами
        if (filter?.serviceName) {
            results = results.filter(
                (clinic: IClinic) => clinic.services.length > 0,
            );
        }

        // Фільтрація за лікарями
        if (filter?.doctorName) {
            results = results.filter(
                (clinic: IClinic) => clinic.doctors.length > 0,
            );
        }

        return results;
    }

    public getClinicById(id: string): Promise<IClinic> {
        return this.getBaseQuery(Clinic.findById(id)).exec();
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
