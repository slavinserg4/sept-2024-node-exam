import { IPaginationQuery } from "../interfaces/IQuery";
import { IService, IServiceDTO } from "../interfaces/service.interface";
import { Service } from "../models/service.model";

class ServiceRepository {
    private readonly defaultSelect = {
        select: "name",
        doctorPopulate: {
            path: "doctorId",
            select: "_id firstName lastName",
        },
        clinicPopulate: {
            path: "clinicId",
            select: "_id name",
        },
    };

    private getBaseQuery(query: any, sortDirection?: string) {
        const baseQuery = query
            .select(this.defaultSelect.select)
            .populate(this.defaultSelect.clinicPopulate)
            .populate(this.defaultSelect.doctorPopulate);
        if (sortDirection) {
            baseQuery.sort({ name: sortDirection === "asc" ? 1 : -1 });
        }
        return baseQuery;
    }

    public async getAllServices(
        query?: IPaginationQuery,
        sortDirection?: string,
    ): Promise<{ services: IService[]; total: number }> {
        const baseQuery = Service.find();

        const total = await Service.countDocuments();

        if (query?.page && query?.pageSize) {
            const skip = (query.page - 1) * query.pageSize;
            baseQuery.skip(skip).limit(query.pageSize);
        }

        const services = await this.getBaseQuery(baseQuery, sortDirection);

        return {
            services,
            total,
        };
    }

    public getServiceById(id: string): Promise<IService> {
        return this.getBaseQuery(Service.findById(id)).exec();
    }

    public async getServiceByName(
        name: string,
        sortDirection?: string,
        query?: IPaginationQuery,
    ): Promise<{ services: IService[]; total: number }> {
        const baseQuery = Service.find({
            name: { $regex: name, $options: "i" },
        });

        const total = await Service.countDocuments({
            name: { $regex: name, $options: "i" },
        });

        if (query?.page && query?.pageSize) {
            const skip = (query.page - 1) * query.pageSize;
            baseQuery.skip(skip).limit(query.pageSize);
        }

        const services = await this.getBaseQuery(baseQuery, sortDirection);

        return {
            services,
            total,
        };
    }

    public async createService(service: IServiceDTO): Promise<IService> {
        const createdService = await Service.create(service);
        return this.getBaseQuery(Service.findById(createdService._id)).exec();
    }

    public updateServiceById(id: string, dto: IServiceDTO): Promise<IService> {
        return this.getBaseQuery(
            Service.findByIdAndUpdate(id, dto, { new: true }),
        ).exec();
    }
    public deleteServiceById(id: string) {
        return this.getBaseQuery(Service.findByIdAndDelete(id));
    }
}

export const serviceRepository = new ServiceRepository();
