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

    public async getAllClinics(
        filter?: IClinicFilter,
    ): Promise<{ clinics: IClinic[]; total: number }> {
        let baseQuery = Clinic.find();

        if (filter?.clinicName) {
            baseQuery = baseQuery.where("name", {
                $regex: filter.clinicName,
                $options: "i",
            });
        }

        const total = await Clinic.countDocuments(baseQuery.getFilter());

        baseQuery = this.getBaseQuery(baseQuery, filter);

        if (filter?.page && filter?.pageSize) {
            const skip = (filter.page - 1) * filter.pageSize;
            baseQuery = baseQuery.skip(skip).limit(filter.pageSize);
        }

        const results = await baseQuery.exec();
        let filteredResults = results;

        if (filter?.serviceName || filter?.doctorName) {
            filteredResults = results.filter((clinic: IClinic) => {
                const hasMatchingServices = filter.serviceName
                    ? clinic.services.length > 0
                    : true;

                const hasMatchingDoctors = filter.doctorName
                    ? clinic.doctors.length > 0
                    : true;

                return hasMatchingServices && hasMatchingDoctors;
            });
        }

        return {
            clinics: filteredResults,
            total: total,
        };
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
